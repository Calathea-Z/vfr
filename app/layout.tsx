import "./globals.css";
import StoreProviderWrapper from "./components/clientWrappers/StoreProviderWrapper";
import Cart from "./components/shop/Cart";
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
			<body className={playfairDisplay.className}>
				<SnackbarProvider>
					<AppRouterCacheProvider>
						<SessionProvider>
							<StoreProviderWrapper>
								{children}
								<Cart />
							</StoreProviderWrapper>
						</SessionProvider>
					</AppRouterCacheProvider>
				</SnackbarProvider>
			</body>
		</html>
	);
};

export default RootLayout;
