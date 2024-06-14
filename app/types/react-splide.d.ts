declare module "@splidejs/react-splide" {
	import { ComponentType, ReactNode } from "react";

	interface SplideProps {
		options?: object;
		children?: ReactNode;
		[key: string]: any;
	}

	export const Splide: ComponentType<SplideProps>;
	export const SplideSlide: ComponentType<SplideProps>;
}
