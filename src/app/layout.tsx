import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from '../lib/registry';
import { ThemeProvider } from '../components/ThemeProvider';
import { Nav } from '@/components/Nav';

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Zain&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
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
