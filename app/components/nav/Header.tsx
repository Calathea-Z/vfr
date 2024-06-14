"use client";
import { simpleLogo } from "@/public/assets";
//--Framework--//
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // Import usePathname
import Image from "next/legacy/image";
import Link from "next/link";
//---Packages---//
import { AppBar, Toolbar, IconButton } from "@mui/material";
import { Microscope, UserCircle, Basket, List } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const Header = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		console.log("Toggling menu:", !isMenuOpen);
		setIsMenuOpen(!isMenuOpen);
	};

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
			}, 6000);

			return () => clearTimeout(timer);
		}
	}, [pathname, isFirstLoad]);

	const handleNavigate = (url: string) => {
		router.push(url);
	};

	return (
		<>
			<AppBar position="sticky" color="default">
				<Toolbar className="flex justify-between">
					<div className="hidden md:flex md:flex-1 justify-start space-x-4 md:text-xl lg:text-2xl">
						<Link
							className={`hover-underline-animation ${pathname === "/" ? "text-emerald-600" : ""}`}
							href="/"
						>
							Home
						</Link>
						<Link
							className={`hover-underline-animation ${pathname === "/shop" ? "text-emerald-600" : ""}`}
							href="/shop"
						>
							Shop
						</Link>
						<Link
							className={`hover-underline-animation ${pathname === "/shop/wholesale" ? "text-emerald-600" : ""}`}
							href="/shop/wholesale"
						>
							Wholesale
						</Link>
						<Link
							className={`hover-underline-animation ${pathname === "/info/stockists" ? "text-emerald-600" : ""}`}
							href="/info/stockists"
						>
							Stockists
						</Link>
						<Link
							className={`hover-underline-animation ${pathname === "/info" ? "text-emerald-600" : ""}`}
							href="/info"
						>
							About
						</Link>
					</div>
					{/* Logo Section */}
					{pathname === "/" && isFirstLoad ? (
						<motion.div
							className="flex-1 justify-center hidden md:flex rounded-sm"
							initial={{ opacity: 0, backgroundColor: "rgba(0, 0, 0, 0)" }}
							animate={{
								opacity: 1,
								backgroundColor: "#f2c88c",
								scale: 1.0,
								transition: { duration: 4 },
							}}
							exit={{
								opacity: 0,
								backgroundColor: "rgba(0, 0, 0, 0)",
								transition: { duration: 4 },
							}}
							transition={{
								duration: 5,
								ease: "easeInOut",
							}}
						>
							<Link href="/">
								<Image src={simpleLogo} alt="Logo" width={100} height={100} />
							</Link>
						</motion.div>
					) : (
						<div className="flex-1 justify-center hidden md:flex rounded-lg">
							<Link href="/">
								<Image src={simpleLogo} alt="Logo" width={100} height={100} />
							</Link>
						</div>
					)}
					{/* Menu Section */}
					<div className="hidden md:flex md:flex-1 justify-end space-x-4">
						<IconButton onClick={() => handleNavigate("/search")}>
							<Microscope className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8" />
						</IconButton>
						<IconButton onClick={() => handleNavigate("/userDashboard")}>
							<UserCircle className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8" />
						</IconButton>
						<IconButton onClick={() => handleNavigate("/cart")}>
							<Basket className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8" />
						</IconButton>
					</div>
					{/* Mobile Menu Section */}
					<div className="md:hidden flex items-center justify-between w-full">
						<IconButton onClick={toggleMenu}>
							<List size={24} />
						</IconButton>
						<Link href="/">
							<Image src={simpleLogo} alt="Logo" width={70} height={70} />
						</Link>
						<div className="flex items-center space-x-1">
							<IconButton onClick={() => handleNavigate("/search")}>
								<Microscope size={16} />
							</IconButton>
							<IconButton onClick={() => handleNavigate("/cart")}>
								<Basket size={16} />
							</IconButton>
						</div>
					</div>
					{/* Mobile Menu Overlay */}
					{isMenuOpen && (
						<div className="absolute top-full left-0 w-full rounded-b-lg bg-white shadow-md flex flex-col items-left space-y-2 p-4">
							<Link
								href="/shop"
								className={`p-1 hover:bg-emerald-500 hover:rounded-sm hover:text-primary ${pathname === "/shop" ? "text-emerald-600" : ""}`}
								onClick={() => setIsMenuOpen(false)}
							>
								Shop
							</Link>
							<Link
								href="/userDashboard"
								className={`p-1 hover:bg-emerald-500 hover:rounded-sm hover:text-primary ${pathname === "/userDashboard" ? "text-emerald-600" : ""}`}
								onClick={() => setIsMenuOpen(false)}
							>
								My Account
							</Link>
							<Link
								href="/info/stockists"
								className={`p-1 hover:bg-emerald-500 hover:rounded-sm hover:text-primary ${pathname === "/info/stockists" ? "text-emerald-600" : ""}`}
								onClick={() => setIsMenuOpen(false)}
							>
								Stockists
							</Link>
							<Link
								href="/info"
								className={`p-1 hover:bg-emerald-500 hover:rounded-sm hover:text-primary ${pathname === "/info" ? "text-emerald-600" : ""}`}
								onClick={() => setIsMenuOpen(false)}
							>
								About
							</Link>
							<Link
								href="/shop/wholesale"
								className={`p-1 hover:bg-emerald-500 hover:rounded-sm hover:text-primary ${pathname === "/shop/wholesale" ? "text-emerald-600" : ""}`}
								onClick={() => setIsMenuOpen(false)}
							>
								Wholesale
							</Link>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</>
	);
};

export default Header;
