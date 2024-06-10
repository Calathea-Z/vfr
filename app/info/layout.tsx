import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";

const InfoLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="bg-primary">
			<Header />
			{children}
			<Footer />
		</div>
	);
};

export default InfoLayout;
