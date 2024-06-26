import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";
//---Framework---//
import { FC, ReactNode } from "react";

const UserAccountLayout: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<section className="bg-primary">
			<Header />
			{children}
			<Footer />
		</section>
	);
};

export default UserAccountLayout;
