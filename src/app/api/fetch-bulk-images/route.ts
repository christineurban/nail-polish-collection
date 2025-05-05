import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { logger } from '@/lib/logger';

function fetchUrl(url: string, retryCount = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const maxRetries = 3;
      const timeout = 30000;
      const retryDelay = retryCount * 2000;

      logger.info(`Fetching URL: ${url} (Attempt ${retryCount + 1}/${maxRetries + 1})`);

      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        rejectUnauthorized: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Referer': parsedUrl.origin,
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout
      };

      const protocol = parsedUrl.protocol === 'https:' ? require('https') : require('http');
      const req = protocol.get(options, (res: any) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
          const redirectUrl = res.headers.location;
          if (redirectUrl) {
            logger.info(`Following redirect to: ${redirectUrl}`);
            const absoluteRedirectUrl = redirectUrl.startsWith('http')
              ? redirectUrl
              : new URL(redirectUrl, `${parsedUrl.protocol}//${parsedUrl.host}`).toString();
            return resolve(fetchUrl(absoluteRedirectUrl, 0));
          }
        }

        if (res.statusCode && res.statusCode >= 500) {
          const error = new Error(`Server error! status: ${res.statusCode} for URL: ${url}`);
          if (retryCount < maxRetries) {
            logger.warn(`Server error (${res.statusCode}), retrying in ${retryDelay}ms...`);
            setTimeout(() => {
              resolve(fetchUrl(url, retryCount + 1));
            }, retryDelay);
            return;
          }
          logger.error(`Max retries reached for server error: ${url}`);
          return reject(error);
        }

        let data = '';
        res.on('data', (chunk: string) => {
          data += chunk;
        });

        res.on('end', () => {
          logger.info(`Successfully fetched URL: ${url}`);
          resolve(data);
        });

        res.on('error', (error: Error) => {
          logger.error(`Response error for ${url}: ${error.message}`);
          if (retryCount < maxRetries) {
            logger.warn(`Retrying in ${retryDelay}ms...`);
            setTimeout(() => {
              resolve(fetchUrl(url, retryCount + 1));
            }, retryDelay);
            return;
          }
          reject(error);
        });
      });

      req.on('error', (error: Error) => {
        logger.error(`Request error for ${url}: ${error.message}`);
        if (retryCount < maxRetries) {
          logger.warn(`Retrying in ${retryDelay}ms...`);
          setTimeout(() => {
            resolve(fetchUrl(url, retryCount + 1));
          }, retryDelay);
          return;
        }
        reject(error);
      });

      req.on('timeout', () => {
        logger.warn(`Request timeout for ${url}`);
        req.destroy();
        if (retryCount < maxRetries) {
          logger.warn(`Retrying in ${retryDelay}ms...`);
          setTimeout(() => {
            resolve(fetchUrl(url, retryCount + 1));
          }, retryDelay);
          return;
        }
        logger.error(`Max retries reached for timeout: ${url}`);
        reject(new Error(`Request timed out for: ${url}`));
      });

      req.end();
    } catch (error) {
      logger.error(`Invalid URL: ${url}`);
      reject(new Error('Invalid URL'));
    }
  });
}

function normalizeUrl(url: string | null | undefined, baseUrl: string): string | null {
  try {
    if (!url || typeof url !== 'string' || url.startsWith('data:')) return null;

    url = url.trim();
    if (url.startsWith('//')) url = `https:${url}`;

    if (!url.startsWith('http')) {
      try {
        const base = new URL(baseUrl);
        url = new URL(url, `${base.protocol}//${base.host}`).toString();
      } catch (e) {
        return null;
      }
    }

    let cleanUrl: URL;
    try {
      cleanUrl = new URL(url);
    } catch (e) {
      return null;
    }

    cleanUrl.search = '';
    cleanUrl.hash = '';

    return cleanUrl.toString();
  } catch (error) {
    return null;
  }
}

function extractSrcsetUrls(srcset: string): string[] {
  return srcset.split(',')
    .map(part => part.trim().split(/\s+/)[0])
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'URLs array is required' }, { status: 400 });
    }

    const allImages = new Map<string, { url: string; brand: string; name: string }>();

    // Fetch and process each URL in parallel
    await Promise.all(urls.map(async (url) => {
      try {
        const html = await fetchUrl(url);
        if (!html || html.length === 0) return;

        const $ = cheerio.load(html);
        const rows = $('tr');

        rows.each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length >= 3) {
            const imgCell = cells.eq(0);
            const brandCell = cells.eq(1);
            const nameCell = cells.eq(2);

            const img = imgCell.find('img');
            const brand = brandCell.text().trim();
            const name = nameCell.text().trim();

            const src = img.attr('src');
            const dataSrc = img.attr('data-src');
            const dataSrcset = img.attr('data-srcset');
            const dataSrcLarge = img.attr('data-large-src');
            const dataSrcMedium = img.attr('data-medium-src');

            const isAcceptableImage = (imgUrl: string) => {
              const cleanUrl = imgUrl.toLowerCase().split('?')[0].split('#')[0];
              return !cleanUrl.endsWith('.svg') &&
                     !cleanUrl.endsWith('.gif') &&
                     !cleanUrl.endsWith('.ico');
            };

            [src, dataSrc, dataSrcLarge, dataSrcMedium].forEach(imgSrc => {
              if (imgSrc && typeof imgSrc === 'string' && isAcceptableImage(imgSrc)) {
                const normalizedSrc = normalizeUrl(imgSrc, url);
                if (normalizedSrc && brand && name) {
                  allImages.set(normalizedSrc, {
                    url: normalizedSrc,
                    brand,
                    name
                  });
                }
              }
            });

            if (dataSrcset) {
              const srcsetUrls = extractSrcsetUrls(dataSrcset);
              srcsetUrls.forEach(srcsetUrl => {
                if (isAcceptableImage(srcsetUrl)) {
                  const normalizedUrl = normalizeUrl(srcsetUrl, url);
                  if (normalizedUrl && brand && name) {
                    allImages.set(normalizedUrl, {
                      url: normalizedUrl,
                      brand,
                      name
                    });
                  }
                }
              });
            }
          }
        });
      } catch (error) {
        logger.error(`Error processing URL ${url}:`, error);
      }
    }));

    const imagesArray = Array.from(allImages.values());

    return NextResponse.json({
      images: imagesArray,
      debug: {
        totalUrls: urls.length,
        uniqueImagesFound: imagesArray.length
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch images',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
