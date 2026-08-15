import './globals.css'
import { Providers } from './providers'
import SiteChrome from '@/components/virellis/SiteChrome'

export const metadata = {
  title: 'Virellis: Enterprise Transformation and Programme Delivery',
  description:
    'Virellis is a specialist transformation consultancy helping governments, healthcare, financial services, and technology enterprises deliver complex programmes with confidence. Strategy, governance, AI, and delivery in one operating model.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  )
}
