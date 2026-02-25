import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Ikigai Matemáticas PhBL',
  description: 'Plataforma de Aprendizaje Basado en Fenómenos para Matemáticas - Colegio Ikigai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
