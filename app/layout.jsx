import "@/styles/globals.css";

export const metadata = {
  title: 'Oytunflix',
  description: 'Oytunflix - Redefining the way you consume media.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.webp" />
      </head>
      <body>{children}</body>
    </html>
  )
}
