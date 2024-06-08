import "./globals.css";
import Header from "@/components/Nav/Header";
//---Packages---//
import type { Metadata } from "next";
//---Fonts---//
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { Playfair_Display } from "next/font/google";
const playfairDisplay = Playfair_Display({
      weight: ['400', '700'], // Regular and Bold
      style: ['normal', 'italic'],
      subsets: ['latin'],
      display: 'swap',

})

export const metadata: Metadata = {
	title: "Vine & Frond",
	description: "Handmade Ceramics & More. Hendersonville, NC",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={playfairDisplay.className}>
				<Header />
				{children}
			</body>
		</html>
	);
}
