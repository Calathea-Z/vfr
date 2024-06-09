"use client";
import { simpleLogo } from "@/public/assets";
//--Framework--//
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // Import usePathname
import Image from "next/image";
import Link from "next/link";
//---Packages---//
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { Microscope, UserCircle, Basket, List } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const Header = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		// Check sessionStorage for the first visit flag
		const firstVisit = sessionStorage.getItem("firstVisit");

		if (firstVisit) {
			setIsFirstLoad(false);
		} else {
			if (pathname === "/") {
				sessionStorage.setItem("firstVisit", "false");
				setIsFirstLoad(true);
			}
		}

		// Set isFirstLoad to false after the animation duration only if it's the first load
		if (isFirstLoad && pathname === "/") {
			const timer = setTimeout(() => {
				setIsFirstLoad(false);
			}, 4000);

			return () => clearTimeout(timer);
		}
	}, [pathname, isFirstLoad]);

	const handleNavigate = (url: string) => {
		router.push(url);
	};

	return (
		<AppBar position="sticky" color="default">
			<Toolbar className="flex justify-between">
				<div className="hidden md:flex md:flex-1 justify-start space-x-4">
					<Link href="/">Home</Link>
					<Link href="/shop">Shop</Link>
					<Link href="/shop/wholesale">Wholesale</Link>
					<Link href="/info/stockists">Stockists</Link>
					<Link href="/info">About</Link>
				</div>
				{pathname === "/" && isFirstLoad ? (
					<motion.div
						className="flex-1 justify-center hidden md:flex rounded-lg"
						initial={{ opacity: 0, backgroundColor: "#F5F5F5" }}
						animate={{
							opacity: [0, 1, 1, 1],
							backgroundColor: ["#F5F5F5", "#f2c88c", "#f2c88c", "#F5F5F5"],
							scale: [0.5, 0.85, 0.9, 0.95, 1.0], // Added more scale values for an even smoother grow and shrink effect
						}}
						exit={{ opacity: 1, backgroundColor: "#F5F5F5", scale: 1.0, y: 0 }}
						transition={{
							duration: 4,
							ease: "easeInOut",
							// times: [0, 0.3, 0.7, 0.9], // Adjusted timing for smoother transitions
						}}
					>
						<Link href="/">
							<Image src={simpleLogo} alt="Logo" width={80} height={80} />
						</Link>
					</motion.div>
				) : (
					<div className="flex-1 justify-center hidden md:flex rounded-lg">
						<Link href="/">
							<Image src={simpleLogo} alt="Logo" width={80} height={80} />
						</Link>
					</div>
				)}
				<div className="hidden md:flex md:flex-1 justify-end space-x-4">
					<IconButton onClick={() => handleNavigate("/search")}>
						<Microscope size={24} />
					</IconButton>
					<IconButton onClick={() => handleNavigate("/userDashboard")}>
						<UserCircle size={24} />
					</IconButton>
					<IconButton onClick={() => handleNavigate("/cart")}>
						<Basket size={24} />
					</IconButton>
				</div>

				<div className="md:hidden flex items-center justify-between w-full">
					<Link href="/">
						<Image src={simpleLogo} alt="Logo" width={60} height={60} />
					</Link>
					<div className="flex items-center space-x-4">
						<IconButton onClick={() => handleNavigate("/cart")}>
							<Basket size={24} />
						</IconButton>
						<IconButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
							<List size={24} />
						</IconButton>
					</div>
				</div>

				{isMenuOpen && (
					<div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 p-4">
						<Link href="/shop">Shop</Link>
						<Link href="/shop/wholesale">Wholesale</Link>
						<Link href="/info/stockists">Stockists</Link>
						<Link href="/info">About</Link>
						<Link href="/search">Search</Link>
						<Link href="/userDashboard">Account</Link>
					</div>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Header;
