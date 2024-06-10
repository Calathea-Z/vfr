import Header from "./components/nav/Header";
import Hero from "./components/homePage/Hero";

const Home = () => {
	return (
		<>
			<Header />
			<main className="flex min-h-screen flex-col items-center justify-between bg-primary">
				<Hero />
			</main>
		</>
	);
};

export default Home;
