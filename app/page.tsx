import Header from "./components/nav/Header";
import Hero from "./components/homePage/Hero";
import Footer from "./components/nav/Footer";
import FeaturedProducts from "./components/homePage/FeaturedProducts";
import TagLinesWrapper from "./components/clientWrappers/TagLinesWrapper";
import { LogoBanner } from "./components/homePage/LogoBanner";

const Home = () => {
	return (
		<>
			<Header />
			<main className="flex min-h-screen flex-col items-center justify-between bg-primary">
				<Hero />
				<FeaturedProducts />
				<LogoBanner />
				<TagLinesWrapper />
			</main>
			<Footer />
		</>
	);
};

export default Home;
