import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/HomePage/contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Joke Generator - Brighten Your Day',
  description:
    'Generate hilarious jokes from various categories. Perfect for breaking the ice or just having a laugh!'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} overflow-x-hidden h-full m-0 p-0`}>
        <ThemeProvider>
          <div className="min-h-screen h-full w-full bg-white dark:bg-black transition-colors duration-300 m-0 p-0">
            <main className="w-full h-full">{children}</main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)'
              },
              className: 'dark:bg-gray-800 dark:text-white'
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
