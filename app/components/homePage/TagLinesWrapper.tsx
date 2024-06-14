"use client";
import { useInView } from "react-intersection-observer";
import TagLines from "./TagLines";

const TagLinesWrapper: React.FC = () => {
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
