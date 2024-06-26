"use client";
import TagLines from "../homePage/TagLines";
//---Framework---//
import { FC } from "react";
//---Packages---//
import { useInView } from "react-intersection-observer";

const TagLinesWrapper: FC = () => {
	const { ref, inView } = useInView({
		threshold: 0.5,
		triggerOnce: true,
	});

	return (
		<div ref={ref}>
			<TagLines inView={inView} />
		</div>
	);
};

export default TagLinesWrapper;
