import Header from "../components/nav/Header";

const InfoLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="bg-primary">
			<Header />
			{children}
		</section>
	);
};

export default InfoLayout;
