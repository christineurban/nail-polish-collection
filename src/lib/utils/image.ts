import { supabaseAdmin } from '@/lib/supabase';
import sharp from 'sharp';

export function createUrlSafeFilename(brand: string, name: string): string {
  // Remove special characters and spaces, convert to lowercase
  const safeBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // Remove consecutive dashes and trim dashes from ends
  const cleanBrand = safeBrand.replace(/-+/g, '-').replace(/^-|-$/g, '');
  const cleanName = safeName.replace(/-+/g, '-').replace(/^-|-$/g, '');

  return `${cleanBrand}_${cleanName}.jpg`;
}

export async function uploadImageToSupabase(imageUrl: string, polish: { brands: { name: string }, name: string }): Promise<string> {
  // Fetch the image
  const response = await fetch(imageUrl);
  const imageBuffer = await response.arrayBuffer();

  // Compress the image using sharp
  const compressedImageBuffer = await sharp(Buffer.from(imageBuffer))
    .resize(800, 800, { // Resize to max dimensions while maintaining aspect ratio
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ // Convert to JPEG and compress
      quality: 80,
      mozjpeg: true
    })
    .toBuffer();

  // Create a URL-safe filename with brand and polish name
  const fileName = createUrlSafeFilename(polish.brands.name, polish.name);

  // Upload to Supabase storage with upsert to handle duplicates
  const { data, error } = await supabaseAdmin.storage
    .from('nail-polish-images')
    .upload(fileName, compressedImageBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload image to Supabase: ${error.message}`);
  }

  // Get the public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('nail-polish-images')
    .getPublicUrl(fileName);

  return publicUrl;
}
