import Header from "./components/nav/Header";
import Hero from "./components/homePage/Hero";
import Footer from "./components/nav/Footer";
import FeaturedProducts from "./components/homePage/FeaturedProducts";

const Home = () => {
	return (
		<>
			<Header />
			<main className="flex min-h-screen flex-col items-center justify-between bg-primary">
				<Hero />
				<FeaturedProducts />
			</main>
			<Footer />
		</>
	);
};

export default Home;
