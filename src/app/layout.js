import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

export const metadata = {
  title: 'HIRE SENSE — Resume Truth Engine',
  description: 'Cross-verify resumes against real-world evidence.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="ml-[220px] flex-1 min-h-screen bg-[#F2F2F0] max-sm:ml-0 max-sm:mb-[60px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
