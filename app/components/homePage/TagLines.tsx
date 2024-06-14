"use client";
import { motion } from "framer-motion";
import React from "react";

interface TagLinesProps {
	inView: boolean;
}

const TagLines: React.FC<TagLinesProps> = ({ inView }) => {
	return (
		<div className="flex justify-center items-center p-6 gap-2 sm:gap-6 lg:gap-20">
			<motion.h1
				whileHover={{
					scale: 1.1,
					textShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)",
				}}
				className="p-2 text-xl sm:text-3xl md:text-4xl lg:text-6xl italic text-emerald-500"
				initial={{ x: -1000 }}
				animate={{ x: inView ? 0 : -500 }}
				transition={{ type: "spring", stiffness: 30 }}
			>
				<span className="text-secondary font-extrabold not-italic">@</span>
				vineandfrond
			</motion.h1>
			<motion.h1
				whileHover={{
					scale: 1.1,
					textShadow: "0px 0px 8px rgba(255, 255, 255, 0.8)",
				}}
				className="p-2 text-xl sm:text-3xl md:text-4xl lg:text-6xl italic text-emerald-500"
				initial={{ x: 1000 }}
				animate={{ x: inView ? 0 : 500 }}
				transition={{ type: "spring", stiffness: 30 }}
			>
				<span className="text-secondary font-extrabold not-italic">#</span>
				vineandfrond
			</motion.h1>
		</div>
	);
};

export default TagLines;
