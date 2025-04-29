/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chtrurfwapzdhgclbhna.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    // Add resolve alias for src directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    // Handle modern JavaScript features including private class fields
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-transform-private-methods',
            '@babel/plugin-transform-class-properties'
          ]
        }
      }
    });

    return config;
  },
};

export default nextConfig;
