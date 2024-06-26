import { fullLogo } from "@/public/assets";
//---Framework---//
import { FC } from "react";
//---Packages---//
import { Box } from "@mui/material";

export const LogoBanner: FC = () => {
	return (
		<Box
			display="grid"
			gridTemplateColumns={{
				xs: "repeat(1, 1fr)",
				sm: "repeat(2, 1fr)",
				md: "repeat(2, 1fr)",
				lg: "repeat(4, 1fr)",
			}}
			width="100%"
			padding="1rem"
			overflow="hidden" // Added to prevent overflow on mobile screens
		>
			{[...Array(4)].map((_, index) => (
				<Box
					key={index}
					display={{
						xs: index === 0 ? "block" : "none",
						sm: index < 2 ? "block" : "none",
						md: index < 2 ? "block" : "none",
						lg: "block",
					}}
					overflow="hidden" // Added to prevent overflow on mobile screens
				>
					<img
						src={fullLogo.src}
						alt="Full Logo"
						style={{ width: "100%", height: "auto" }}
					/>
				</Box>
			))}
		</Box>
	);
};
