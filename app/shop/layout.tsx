import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";
import { playfairDisplay } from "../fonts/fonts";
const ShopLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className={`bg-primary`}>
			<Header />
			<div className={`${playfairDisplay.className}`}>{children}</div>
			<Footer />
		</div>
	);
};

export default ShopLayout;
