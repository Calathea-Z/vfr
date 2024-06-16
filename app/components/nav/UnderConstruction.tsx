"use client";
import { Barricade, HardHat } from "@phosphor-icons/react";

const UnderConstruction = () => {
	return (
		<div className="flex flex-col justify-start items-center h-screen bg-gradient-to-l from-stone-900 to-black text-yellow-500 text-4xl text-center pt-20">
			<Barricade size={200} weight="bold" />
			<span>
				Under Construction
				<HardHat size={32} />
			</span>
		</div>
	);
};

export default UnderConstruction;
