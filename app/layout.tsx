import "./globals.css";
//---Framework---//
import type { Metadata } from "next";
//---Packages---//
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SnackbarProvider } from "notistack";
import { SessionProvider } from "next-auth/react";
//---Fonts---//
import { playfairDisplay } from "./fonts/fonts";

export const metadata: Metadata = {
	title: "Vine & Frond",
	description: "Handmade Ceramics & More. Hendersonville, NC",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<SnackbarProvider>
				<AppRouterCacheProvider>
					<SessionProvider>
						<body className={playfairDisplay.className}>{children}</body>
					</SessionProvider>
				</AppRouterCacheProvider>
			</SnackbarProvider>
		</html>
	);
};

export default RootLayout;
