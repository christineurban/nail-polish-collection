import React from 'react';
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import StyledComponentsRegistry from '../lib/registry';
import { ThemeProvider } from '../theme';
import { Nav } from '@/components/Nav';

const onest = Onest({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-onest',
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
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
