"use client";
import { simpleLogo } from "@/public/assets";
import { stateStorage } from "@/utils/stateStorage";
import { SanityClient } from "sanity";
//---Packages---//
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Microscope, UserCircle, Basket, List } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Cookies from "universal-cookie";

interface Category {
	title: string;
	subMenuImage: string;
	ordinal: number;
	imageUrl?: string;
}

const Header = () => {
	// const context = useContext(stateStorage);
	// if (!context) {
	// 	throw new Error("stateStorage context is not available");
	// }
	// const { state, dispatch } = context;
	// const { cart, isCartVisible } = state;
	const navigate = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleNavigate = (url: string) => {
		navigate.push(url);
	};

	return (
		<nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-md p-4 flex justify-between items-center">
			<div className="hidden md:flex md:flex-1 justify-start space-x-4">
				<Link href="/">Home</Link>
				<Link href="/shop">Shop</Link>
				<Link href="/contact">Wholesale</Link>
				<Link href="/contact">Stockists</Link>
				<Link href="/about">About</Link>
			</div>

			<div className="flex-1 justify-center hidden md:flex">
				<Link href="/">
					<Image src={simpleLogo} alt="Logo" width={60} height={60} />
				</Link>
			</div>

			<div className="hidden md:flex md:flex-1 justify-end space-x-4">
				<button onClick={() => handleNavigate("/search")}>
					<Microscope size={24} />
				</button>
				<button onClick={() => handleNavigate("/account")}>
					<UserCircle size={24} />
				</button>
				<button onClick={() => handleNavigate("/cart")}>
					<Basket size={24} />
				</button>
			</div>

			<div className="md:hidden flex items-center justify-between w-full">
				<Link href="/">
					<Image src={simpleLogo} alt="Logo" width={60} height={60} />
				</Link>
				<div className="flex items-center space-x-4">
					<button onClick={() => handleNavigate("/cart")}>
						<Basket size={24} />
					</button>
					<button onClick={() => setIsMenuOpen(!isMenuOpen)}>
						<List size={24} />
					</button>
				</div>
			</div>

			{isMenuOpen && (
				<div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 p-4">
					<Link href="/services">Shop</Link>
					<Link href="/contact">Wholesale</Link>
					<Link href="/contact">Stockists</Link>
					<Link href="/search">Search</Link>
					<Link href="/account">Account</Link>
				</div>
			)}
		</nav>
	);
};

export default Header;
