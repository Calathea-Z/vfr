import Header from "@/components/Nav/Header";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24 bg-primary">
            <Header />
			<p className="text-secondary">Sanity :D</p>
		</main>
	);
}
