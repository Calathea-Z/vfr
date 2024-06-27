"use client";
import { LeftSideButtonData } from "@/types/types";
//---Framework---//
import { useEffect, useState, FC } from "react";
import axios from "axios";
import Link from "next/link";
//---Fonts---//
import { playfairDisplay } from "@/app/fonts/fonts";
import { X } from "@phosphor-icons/react";

const LeftSideButton: FC = () => {
	const [leftSideButtonData, setLeftSideButtonData] =
		useState<LeftSideButtonData | null>(null);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("/api/layout/left-side-button");
				if (response.data) {
					setLeftSideButtonData(response.data);
				}
			} catch (error) {
				console.error("Error fetching side button data:", error);
			}
		};

		fetchData();
	}, []);

	if (!leftSideButtonData || !leftSideButtonData.enabled || !isVisible) {
		return null;
	}
	return (
		<div className="relative">
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
			<button
				className="fixed top-[38%] lg:top-[50.5%] left-[.2rem] -translate-y-1/2 text-sm text-black p-1 z-[400] hover:text-red-500 rounded-full hover:bg-red-50"
				onClick={() => setIsVisible(false)}
				style={{
					writingMode: "vertical-rl",
					transform: "rotate(180deg)",
					color: leftSideButtonData.textColor?.hex || "black",
				}}
			>
				<X className="w-4 h-4" />
			</button>
		</div>
	);
};

export default LeftSideButton;
