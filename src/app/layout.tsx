import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: {
		template: '%s – My Contentful Blog',
		default: 'My Contentful Blog',
	},
}

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	)
}

export default RootLayout
