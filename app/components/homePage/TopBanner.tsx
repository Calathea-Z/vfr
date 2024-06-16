"use client";
import { useEffect, useState } from "react";
import client from "../../../sanity/lib/client";
import Link from "next/link";

interface TopBannerData {
	backgroundColor: { hex: string };
	textColor: { hex: string };
	link: string;
	text: string;
	enabled: boolean;
}

const TopBanner: React.FC = () => {
	const [topBannerData, setTopBannerData] = useState<TopBannerData | null>(
		null
	);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const query = `*[_type == "topBanner" && enabled == true][0]`;
			const data = await client.fetch(query);
			if (data) {
				setTopBannerData(data);
			}
		};

		const isBannerClosed = sessionStorage.getItem("topBannerClosed");
		if (isBannerClosed === "true") {
			setIsVisible(false);
		}

		fetchData();
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		sessionStorage.setItem("topBannerClosed", "true");
	};

	if (!topBannerData || !topBannerData.enabled || !isVisible) {
		return null;
	}

	return (
		<div
			style={{
				backgroundColor: topBannerData.backgroundColor.hex,
				color: topBannerData.textColor.hex,
				height: "50px",
				zIndex: 7000,
				borderBottom: "1px solid #000000",
			}}
			className="w-full flex justify-center items-center relative"
			id="top-banner"
		>
			<Link
				href={topBannerData.link}
				passHref
				className="hover:underline underline-offset-2 text-xs md:text-base lg:text-xl xl:text-2xl"
			>
				{topBannerData.text}
			</Link>
			<button
				onClick={handleClose}
				className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
				style={{ background: "none", border: "none", cursor: "pointer" }}
			>
				&times;
			</button>
		</div>
	);
};

export default TopBanner;
