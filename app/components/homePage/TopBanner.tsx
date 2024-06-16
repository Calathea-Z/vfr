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

	useEffect(() => {
		const fetchData = async () => {
			const query = `*[_type == "topBanner" && enabled == true][0]`;
			const data = await client.fetch(query);
			if (data) {
				setTopBannerData(data);
			}
		};

		fetchData();
	}, []);

	if (!topBannerData || !topBannerData.enabled) {
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
			className="w-full flex justify-center items-center"
			id="top-banner"
		>
			<Link
				href={topBannerData.link}
				passHref
				className="hover:underline underline-offset-2 text-xs md:text-base lg:text-xl xl:text-2xl"
			>
				{topBannerData.text}
			</Link>
		</div>
	);
};

export default TopBanner;
