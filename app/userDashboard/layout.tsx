import Header from "../components/nav/Header";

const UserAccountLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="bg-primary">
			<Header />
			{children}
		</section>
	);
};

export default UserAccountLayout;
