"use client";
import { TopBannerData } from "@/types/types";
import { useStateStorage } from "@/utils/stateStorage";
//---Framework---//
import { useEffect, useState, FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
//---Packages---//
import axios from "axios";
import { X } from "@phosphor-icons/react";

const TopBanner: FC = () => {
	const pathname = usePathname();
	const { state, dispatch } = useStateStorage();
	const [topBannerData, setTopBannerData] = useState<TopBannerData | null>(
		null
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("/api/layout/top-banner");
				if (response.data) {
					setTopBannerData(response.data);
				}
			} catch (error) {
				console.error("Error fetching top banner data:", error);
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
				className="absolute right-[.2rem] md:right-4 top-[15%] md:top-1/2 transform -translate-y-1/2 text-black hover:bg-red-50 cursor-pointer rounded-full p-1"
			>
				<X className="w-3 h-3" />
			</button>
		</div>
	);
};

export default TopBanner;
