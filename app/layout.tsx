import "./globals.css";
import type { Metadata } from "next";

//---Fonts---//
import { playfairDisplay } from "./fonts/fonts";

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
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" type="image/svg+xml" href="/icon.svg" />
				<link rel="stylesheet" href="./globals.css" />
			</head>
			<body className={playfairDisplay.className}>{children}</body>
		</html>
	);
}
