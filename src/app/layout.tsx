import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MCPHubz - The Ultimate MCP Ecosystem Platform',
  description: 'Discover, test, and integrate Model Context Protocol servers. The leading platform for MCP development, community, and enterprise solutions.',
  keywords: 'MCP, Model Context Protocol, AI, LLM, Claude, ChatGPT, AI Tools, Developer Platform',
  authors: [{ name: 'Tim Miller', url: 'https://mcphubz.com' }],
  creator: 'MCPHubz',
  publisher: 'MCPHubz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mcphubz.com'),
  openGraph: {
    title: 'MCPHubz - The Ultimate MCP Ecosystem Platform',
    description: 'Discover, test, and integrate Model Context Protocol servers.',
    url: 'https://mcphubz.com',
    siteName: 'MCPHubz',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MCPHubz Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MCPHubz - The Ultimate MCP Ecosystem Platform',
    description: 'Discover, test, and integrate Model Context Protocol servers.',
    creator: '@timmiller99',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}