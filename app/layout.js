import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'
import Script from 'next/script'

export const metadata = {
  title: 'Ravi Gupta - Test Leader, AI Solutions Builder & Quality Engineering',
  description:
    'Ravi Gupta - Senior Technology & Delivery Leader in Auckland, NZ. Test Lead, AI Solutions Builder and Quality Engineering Leader. Featuring the AI EventOps Assistant.',
  metadataBase: new URL('https://ravigupta.dev'),
  icons: {
  icon: '/icon.png',
  apple: '/apple-icon.png',
},
  openGraph: {
    title: 'Ravi Gupta — AI Labs',
    description: 'Test Leader • AI Solutions Builder • Quality Engineering',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>

      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N4H1VS7GWL"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-N4H1VS7GWL');
          `}
        </Script>

        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}