import Header from "../components/nav/Header";

const ShopLayout = ({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) => {
	return (
		<section className="bg-primary">
			<Header />
			{children}
		</section>
	);
};

export default ShopLayout;
