import { heroOne, heroTwo, cellHero } from "@/public/assets/index";
//---Framework---///
import Image from "next/image";
import Link from "next/link";
//---Packages---///

const Hero = () => {
	return (
		<section className="relative w-full h-[400px] md:h-[500px] z-0">
			<picture>
				<source media="(max-width: 450px)" srcSet={cellHero.src} />
				<source media="(min-width: 450px)" srcSet={heroOne.src} />
				<Image
					src={heroTwo.src} // Default image
					alt="A selection of Vine & Frond ceramic pots"
					fill
					priority
					className="object-center"
				/>
			</picture>
			<p
				className="absolute top-5 left-[2rem] text-slate-900 bg-primary opacity-90 p-2 rounded-lg text-2xl sm:text-3xl md:text-5xl italic"
				style={{ width: "max-content", maxWidth: "100%" }}
			>
				🍃 Pots. Plants. Prints.
			</p>
		</section>
	);
};

export default Hero;
