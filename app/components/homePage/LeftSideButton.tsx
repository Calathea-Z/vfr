"use client";
import { LeftSideButtonData } from "@/types/types";
//---Framework---//
import { useEffect, useState, FC } from "react";
import client from "../../../sanity/lib/client";
import Link from "next/link";
//---Fonts---//
import { playfairDisplay } from "@/app/fonts/fonts";

const LeftSideButton: FC = () => {
	const [leftSideButtonData, setLeftSideButtonData] =
		useState<LeftSideButtonData | null>(null);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const query = `*[_type == "sideButton" && enabled == true][0]`;
			const data = await client.fetch(query);
			if (data) {
				setLeftSideButtonData(data);
			}
		};

		fetchData();
	}, []);

	if (!leftSideButtonData || !leftSideButtonData.enabled || !isVisible) {
		return null;
	}
	return (
		<Link href={leftSideButtonData.link} passHref>
			<button
				className="fixed left-[.1rem] top-[38%] lg:top-1/2 -translate-y-1/2 z-[60] flex flex-col justify-center items-center text-white p-5 rounded-md text-center font-bold text-xs sm:text-sm md:text-md lg:text-lg border-[.1rem] border-black shadow-lg hover:bg-secondary"
				id="sideButton"
				style={{
					writingMode: "vertical-rl",
					transform: "rotate(180deg)",
					backgroundColor: leftSideButtonData.backgroundColor?.hex || "white",
					color: leftSideButtonData.textColor?.hex || "black",
				}}
			>
				<span className={`tracking-widest ${playfairDisplay.className}`}>
					{leftSideButtonData.text}
				</span>
			</button>
		</Link>
	);
};

export default LeftSideButton;
