import "./globals.css";
import Header from "@/components/Nav/Header";
//---Packages---//
import type { Metadata } from "next";
//---Fonts---//
import { playfairDisplay } from './fonts/fonts';

export const metadata: Metadata = {
	title: "Vine & Frond",
	description: "Handmade Ceramics & More. Hendersonville, NC",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={playfairDisplay.className}>
				<Header />
				{children}
			</body>
		</html>
	);
}
