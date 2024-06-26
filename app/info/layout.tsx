import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";
//---Framework---//
import { FC } from "react";

const InfoLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="bg-primary">
			<Header />
			{children}
			<Footer />
		</div>
	);
};

export default InfoLayout;
