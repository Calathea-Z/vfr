import { heroOne, heroTwo, cellHero } from "@/public/assets/index";
import Image from "next/image";

const Hero = () => {
	return (
		<section
			aria-label="Hero"
			className="relative w-full h-[400px] md:h-[500px] z-0"
		>
			{/* Single image for extra small screens */}
			<div className="md:hidden w-full h-full">
				<Image
					src={cellHero.src}
					alt="Hero image for extra small screens"
					fill
					className="object-cover border-2 border-black "
					priority
				/>
			</div>
			{/* Single image for small to medium screens */}
			<div className="lg:hidden w-full h-full">
				<Image
					src={heroOne.src}
					alt="Hero image for smaller screens"
					fill
					className="object-cover border-2 border-black "
					priority
				/>
			</div>
			{/* Two images side by side for large screens */}
			<div className="hidden lg:flex w-full h-full">
				<div className="w-1/2 h-full relative">
					<Image
						src={heroOne.src}
						alt="Hero One"
						fill
						className="object-cover border-2 border-black border-r-0"
						priority
					/>
				</div>
				<div className="w-1/2 h-full relative">
					<Image
						src={heroTwo.src}
						alt="Hero Two"
						fill
						className="object-cover border-2 border-black"
						priority
					/>
				</div>
			</div>

			<p
				className="absolute top-12 left-[2rem] text-slate-900 bg-primary opacity-90 p-2 rounded-lg text-2xl sm:text-3xl md:text-5xl italic"
				style={{ width: "max-content", maxWidth: "100%" }}
			>
				🍃 Pots. Plants. Prints.
			</p>
		</section>
	);
};

export default Hero;
