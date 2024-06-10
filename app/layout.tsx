import "./globals.css";
//---Framework---//
import type { Metadata } from "next";
//---Packages---//
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
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
			<AppRouterCacheProvider>
				<body className={playfairDisplay.className}>{children}</body>
			</AppRouterCacheProvider>
		</html>
	);
}
