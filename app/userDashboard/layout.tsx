import Header from "../components/nav/Header";

export default function UserAccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="bg-primary">
			<Header />
			{children}
		</section>
	);
}
