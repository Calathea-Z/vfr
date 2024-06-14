"use client";
import { lato } from "@/app/fonts/fonts";
//---Framework---//
import NextLink from "next/link";
import { useState, useEffect } from "react";
//---Packages---//
import { SocialIcon } from "react-social-icons";
import {
	Box,
	Container,
	Grid,
	Link,
	Typography,
	TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";

const Footer = () => {
	const [isAtBottom, setIsAtBottom] = useState(false);
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + window.innerHeight;
			const bottomPosition = document.documentElement.scrollHeight;
			setIsAtBottom(scrollPosition >= bottomPosition);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const handleLinkClick = (e: React.MouseEvent, href: string) => {
		if (window.location.pathname === href) {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const renderSocialIcons = (iconSize: string) => (
		<Box sx={{ display: "flex", gap: 2 }}>
			<SocialIcon
				url="https://www.instagram.com/vineandfrond/"
				fgColor="#fff"
				bgColor="#000"
				target="_blank"
				rel="noopener noreferrer"
				style={{ width: iconSize, height: iconSize }}
			/>
			<SocialIcon
				url="https://www.facebook.com/vineandfrondceramics"
				fgColor="#fff"
				bgColor="#000"
				target="_blank"
				rel="noopener noreferrer"
				style={{ width: iconSize, height: iconSize }}
			/>
			<SocialIcon
				url="https://www.tiktok.com/@vineandfrond"
				fgColor="#fff"
				bgColor="#000"
				target="_blank"
				rel="noopener noreferrer"
				style={{ width: iconSize, height: iconSize }}
			/>
		</Box>
	);

	return (
		<Box
			component="footer"
			sx={{ py: 4, width: "100%" }}
			className={`bg-secondary ${lato.className}`}
		>
			<Container>
				<Grid container spacing={4}>
					<Grid item xs={12} sm={6} md={3}>
						{renderSocialIcons("40px")}
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Typography variant="h6" gutterBottom>
							Links
						</Typography>
						<Link
							href="/"
							color="inherit"
							sx={{ textDecoration: "none" }}
							onClick={(e) => handleLinkClick(e, "/")}
						>
							Home
						</Link>
						<br />
						<Link
							href="/shop"
							color="inherit"
							sx={{ textDecoration: "none" }}
							onClick={(e) => handleLinkClick(e, "/shop")}
						>
							Shop
						</Link>
						<br />
						<Link
							href="/info/stockists"
							color="inherit"
							sx={{ textDecoration: "none" }}
							onClick={(e) => handleLinkClick(e, "/info/stockists")}
						>
							Stockists
						</Link>
						<br />
						<Link
							href="/info"
							color="inherit"
							sx={{ textDecoration: "none" }}
							onClick={(e) => handleLinkClick(e, "/info")}
						>
							About
						</Link>
						<br />
						<Link
							href="/shop/wholesale"
							color="inherit"
							sx={{ textDecoration: "none" }}
							onClick={(e) => handleLinkClick(e, "/shop/wholesale")}
						>
							Wholesale
						</Link>
						<br />
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Typography variant="h6" gutterBottom>
							Contact
						</Typography>
						<Link
							href="mailto:vineandfrond@gmail.com"
							color="inherit"
							sx={{ textDecoration: "none" }}
						>
							vineandfrond@gmail.com
						</Link>
						<Box mt={2}>
							<Typography variant="body2" gutterBottom>
								Join our mailing list:
							</Typography>
							<form
								autoComplete="off"
								onSubmit={(e) => {
									e.preventDefault();
									const form = e.currentTarget;
									const email = form.email.value;
									const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
									if (emailRegex.test(email)) {
										enqueueSnackbar("Thank you for subscribing!", {
											variant: "success",
										});
									} else {
										enqueueSnackbar("Please enter a valid email address.", {
											variant: "error",
										});
									}
								}}
							>
								<TextField
									variant="outlined"
									size="small"
									label="Email Address"
									type="email"
									name="email"
									fullWidth
									required
								/>
								<button
									type="submit"
									className="mt-1 bg-gray-100 text-black hover:bg-green-600 hover:text-white py-2 px-4 rounded"
								>
									Subscribe
								</button>
							</form>
						</Box>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						sx={{
							display: "flex",
							justifyContent: { xs: "flex-start", sm: "flex-end" },
							alignItems: { xs: "flex-start", sm: "flex-end" },
							pr: 2,
							pb: 2,
						}}
					>
						<Typography
							variant="caption"
							sx={{ fontSize: "0.7rem" }}
							className="hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-400 hover:text-white px-2 py-1 rounded-lg"
						>
							<p>Website Credit:</p>
							<Link
								href="https://zach-sykes.com"
								target="_blank"
								rel="noopener noreferrer"
								color="inherit"
								sx={{ textDecoration: "none" }}
							>
								Calathea Designs
							</Link>
						</Typography>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default Footer;
