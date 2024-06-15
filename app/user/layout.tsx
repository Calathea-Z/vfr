import Header from "../components/nav/Header";
import Footer from "../components/nav/Footer";

const UserAccountLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="bg-primary">
			<Header />
			{children}
			<Footer />
		</section>
	);
};

export default UserAccountLayout;
