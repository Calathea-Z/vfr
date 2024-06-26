"use client";
import client from "../../sanity/lib/client";
import { sanityImageBuilder } from "../../utils/sanityImageBuilder";
import bioPic from "../../public/assets/info/sydney.png";
import { BioData } from "@/types/types";
//---Framework---//
import { useState, useEffect, FC } from "react";
//---Packages---//
import { CardMedia } from "@mui/material";

const About: FC = () => {
	const [bioData, setBioData] = useState<BioData>({
		name: "",
		header: "",
		image: null,
		bio: "",
	});

	useEffect(() => {
		const fetchBioData = async () => {
			const data: any[] = await client.fetch(`*[_type == "bio"]`);
			if (data.length > 0) {
				const {
					header,
					image,
					bio,
				}: { header: string; image: string; bio: string } = data[0];
				setBioData({ ...bioData, header, image, bio });
			}
		};
		fetchBioData();
	}, []);

	return (
		<div className="min-h-screen flex items-start mt-7 justify-center">
			<div className="flex flex-col-reverse lg:flex-row justify-center bg-transparent">
				{/* Image Container */}
				<div className="flex-1 h-[90%] flex items-center justify-center p-4 bg-transparent">
					{bioData.image ? (
						<CardMedia
							component="img"
							image={sanityImageBuilder(bioData.image).url()}
							alt="Photo of Sydney with pottery and plants."
							sx={{
								borderRadius: 4,
								objectFit: "cover",
								height: "100%",
								boxShadow: "0px 0px 10px 0px #049175",
							}}
							onError={(e: any) => {
								e.target.onerror = null;
								e.target.src = bioPic.src;
							}}
						/>
					) : (
						<CardMedia
							component="img"
							image={bioPic.src}
							alt="Photo of Sydney with pottery and plants."
							sx={{
								borderRadius: 4,
								objectFit: "cover",
								height: "100%",
								boxShadow: "0px 0px 10px 0px #049175",
							}}
						/>
					)}
				</div>
				<div className="flex flex-col items-start flex-1 p-8">
					{/* Text container */}
					<h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl text-[#f5ac42] italic font-bold pb-5 sm:pb-10 w-full">
						{bioData.header}
					</h1>
					<p className="text-[1.1rem] xl:text-[1.25rem] text-emerald-800 leading-7 sm:leading-loose lg:leading-loose xl:leading-loose w-full">
						{bioData.bio}
					</p>
				</div>
			</div>
		</div>
	);
};

export default About;
