"use client";
import client from "../../../sanity/lib/client";
import { useStateStorage } from "@/utils/stateStorage";
//---Framework---//
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface TopBannerData {
	backgroundColor: { hex: string };
	textColor: { hex: string };
	link: string;
	text: string;
	enabled: boolean;
}

const TopBanner: React.FC = () => {
	const pathname = usePathname();
	const { state, dispatch } = useStateStorage();
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

		const isBannerClosed = sessionStorage.getItem("topBannerClosed");
		if (isBannerClosed === "true") {
			dispatch({ type: "HIDE_TOP_BANNER" });
		} else {
			dispatch({ type: "SHOW_TOP_BANNER" });
		}

		fetchData();
	}, []);

	const handleClose = () => {
		dispatch({ type: "HIDE_TOP_BANNER" });
		sessionStorage.setItem("topBannerClosed", "true");
	};

	if (pathname === "/user/login") {
		return null;
	}

	if (!topBannerData || !topBannerData.enabled || !state.isTopBannerVisible) {
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
