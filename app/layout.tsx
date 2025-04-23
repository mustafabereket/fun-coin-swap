"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { RootLayoutProps } from "./types";

const queryClient = new QueryClient();

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
