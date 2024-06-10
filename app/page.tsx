import Header from "./components/nav/Header";
import Hero from "./components/homePage/Hero";
import Footer from "./components/nav/Footer";

const Home = () => {
	return (
		<>
			<Header />
			<main className="flex min-h-screen flex-col items-center justify-between bg-primary">
				<Hero />
			</main>
			<Footer />
		</>
	);
};

export default Home;
