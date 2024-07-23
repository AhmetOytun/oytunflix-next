import "@/styles/globals.css";

export const metadata = {
  title: 'Oytunflix',
  description: 'Oytunflix - Redefining the way you consume media.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
