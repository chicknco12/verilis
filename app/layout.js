import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Virellis \u2014 Transforming Strategy into Delivery',
  description:
    'Virellis is the enterprise transformation headquarters \u2014 helping governments, healthcare, financial services and technology enterprises turn complexity into intelligent, predictable delivery.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
