import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Ravi Gupta | Quality Engineering, Applied AI & Test Leadership',
  description:
    'Ravi Gupta AI Labs: practical AI engineering, quality engineering, AI governance, Playwright automation, API testing and interactive learning labs.',
  metadataBase: new URL('https://ravigupta.dev'),
  openGraph: {
    title: 'Ravi Gupta | Quality Engineering & Applied AI',
    description: 'Working AI demonstrations, quality engineering patterns and interactive engineering learning labs.',
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
