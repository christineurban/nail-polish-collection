import React from 'react';
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import StyledComponentsRegistry from '../lib/registry';
import { ThemeProvider } from '../theme';
import { Nav } from '@/components/Nav';
import { MainContainer } from '@/components/MainContainer';

const onest = Onest({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-onest',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Nail Polish Collection",
  description: "Track and manage your nail polish collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={onest.variable}>
      <body className={onest.className}>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <Nav />
            <MainContainer>
              {children}
            </MainContainer>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
