import './globals.css'
import { Providers } from './providers'
import SiteChrome from '@/components/virellis/SiteChrome'

export const metadata = {
  title: 'Virellis: Agile Consulting and Change Management',
  description:
    'Virellis helps complex organisations build agile ways of working and lead change that lasts. Practical consulting for delivery, operating models and adoption.',
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
