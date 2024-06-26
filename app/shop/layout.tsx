import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";
import { playfairDisplay } from "../fonts/fonts";
//---Framework---//
import { FC } from "react";

const ShopLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className={`bg-primary`}>
			<Header />
			<div className={`${playfairDisplay.className}`}>{children}</div>
			<Footer />
		</div>
	);
};

export default ShopLayout;
