import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Ravi Gupta — Test Leader, AI Solutions Builder & Quality Engineering',
  description:
    'Ravi Gupta — Senior Technology & Delivery Leader in Auckland, NZ. Test Lead, AI Solutions Builder and Quality Engineering Leader. Featuring the AI EventOps Assistant.',
  metadataBase: new URL('https://ravigupta.dev'),
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
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
