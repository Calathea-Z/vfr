"use client";
//---Framework---//
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import client from "../../../sanity/lib/client";
import { sanityImageBuilder } from "../../../utils/sanityImageBuilder";
//---Packages---//
import { motion } from "framer-motion";

const ShopSubMenu = ({ isVisible }: { isVisible: boolean }) => {
	const [subMenuImageToShow, setSubMenuImageToShow] = useState<string | null>(
		null
	);
	const [currentCategories, setCurrentCategories] = useState<
		{ title: string; subMenuImage: string }[]
	>([]);
	const [showSubMenu, setShowSubMenu] = useState<boolean>(false);

	useEffect(() => {
		const fetchCategories = async () => {
			const query = `*[_type == "category" && hidden != true] | order(ordinal asc){
                                title,
                                "subMenuImage": subMenuImage.asset._ref,
                                ordinal
                            }`;
			const fetchedCategories = await client.fetch(query);
			setCurrentCategories(fetchedCategories);
			if (fetchedCategories.length > 0) {
				setSubMenuImageToShow(
					sanityImageBuilder(fetchedCategories[0].subMenuImage).url()
				);
			}
		};

		fetchCategories();
	}, []);

	if (!isVisible) return null;

	return (
		<>
			{isVisible && (
				<div className="absolute bg-primary shadow-xl z-20 rounded-xl w-full md:w-[45rem] left-0 top-[1] flex flex-col md:flex-row">
					<div className="w-full md:w-1/4 p-2">
						{currentCategories.map((category) => (
							<motion.div
								key={category.title}
								whileHover={{
									rotate: [0, 1, -1, 1, 0],
									transition: { duration: 0.5 },
								}}
								className="hover:bg-[#ECC89A] rounded-md w-full"
							>
								<Link
									href={
										category.title.trim().toLowerCase() === "all products"
											? "/shop"
											: `/shop/product/category/${category.title.toLowerCase()}`
									}
									className="block text-sm text-gray-700 px-4 py-2 rounded-md hover:font-amaticSC hover:font-semibold hover:text-xl"
									onMouseEnter={() =>
										setSubMenuImageToShow(
											sanityImageBuilder(category.subMenuImage).url()
										)
									}
								>
									{category.title}
								</Link>
							</motion.div>
						))}
					</div>
					<div className="w-full md:w-3/4 relative h-72">
						<div className="absolute inset-0 flex justify-center items-center z-30 border-[.4rem] border-primary rounded-xl">
							{subMenuImageToShow && (
								<Image
									src={subMenuImageToShow}
									alt="Category Image"
									priority={true}
									fill={true}
									className="object-cover rounded-xl"
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ShopSubMenu;
