import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Prompt Refinery',
	description: 'Analyze, Refine, Generate ⚡',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body
				className={cn(
					'flex flex-col min-h-screen h-full bg-gray-50 max-w-7xl mx-auto',
					inter.className
				)}
			>
				<main className='flex flex-1'>{children}</main>
			</body>
		</html>
	);
}
