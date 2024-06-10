"use client";
import { fullLogo, simpleLogo } from "@/public/assets";
import { lato } from "@/app/fonts/fonts";
//---Packages---//
import { SocialIcon } from "react-social-icons";
import {
	Box,
	Container,
	Grid,
	Link,
	Typography,
	TextField,
	Button,
} from "@mui/material";

const Footer = () => {
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
		<Container
			component="footer"
			maxWidth="xl"
			sx={{ py: 4 }}
			className={`bg-secondary ${lato.className}`}
		>
			<Grid container spacing={4}>
				<Grid item xs={12} sm={6} md={3}>
					{renderSocialIcons("36px")}
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Typography variant="h6" gutterBottom>
						Links
					</Typography>
					<Link href="/" color="inherit" sx={{ textDecoration: "none" }}>
						Home
					</Link>
					<br />
					<Link href="/shop" color="inherit" sx={{ textDecoration: "none" }}>
						Shop
					</Link>
					<br />
					<Link
						href="/info/stockists"
						color="inherit"
						sx={{ textDecoration: "none" }}
					>
						Stockists
					</Link>
					<br />
					<Link href="/info" color="inherit" sx={{ textDecoration: "none" }}>
						About
					</Link>
					<br />
					<Link
						href="/shop/wholesale"
						color="inherit"
						sx={{ textDecoration: "none" }}
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
									alert("Thank you for subscribing!");
								} else {
									alert("Please enter a valid email address.");
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
							<Button
								type="submit"
								variant="contained"
								sx={{
									mt: 1,
									bgcolor: "#F5F5F5",
									color: "black",
									"&:hover": {
										bgcolor: "rgb(5 150 105)",
										color: "white",
									},
								}}
							>
								Subscribe
							</Button>
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
						justifyContent: "flex-end",
						alignItems: "flex-end",
					}}
				>
					<Typography
						variant="caption"
						sx={{ fontSize: "0.5rem" }}
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
	);
};

export default Footer;
