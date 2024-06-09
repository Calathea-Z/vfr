import Header from "@/components/Nav/Header";

export default function Home() {
	return (
		<>
			<Header />
			<main className="flex min-h-screen flex-col items-center justify-between p-24 bg-primary">
				<p className="text-secondary">HOME</p>
			</main>
		</>
	);
}
