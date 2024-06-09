"use client";
import { simpleLogo } from "@/public/assets";
//--Framework--//
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
//---Packages---//
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { Microscope, UserCircle, Basket, List } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const Header = () => {
	const navigate = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleNavigate = (url: string) => {
		navigate.push(url);
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
				<motion.div
					className="flex-1 justify-center hidden md:flex rounded-lg"
					initial={{ opacity: 0, backgroundColor: "#F5F5F5" }}
					animate={{
						opacity: [0, 1, 1, 1],
						backgroundColor: ["#F5F5F5", "#f2c88c", "#f2c88c", "#F5F5F5"],
						scale: [0.5, 0.7, 0.9, 1.0],
					}}
					exit={{ opacity: 1, backgroundColor: "#F5F5F5", scale: 1.0, y: 0 }}
					transition={{
						duration: 2,
						ease: "easeInOut",
						times: [0, 0.2, 0.8, 1],
					}}
				>
					<Link href="/">
						<Image src={simpleLogo} alt="Logo" width={80} height={80} />
					</Link>
				</motion.div>
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
