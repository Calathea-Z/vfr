"use client";
import { simpleLogo } from "@/public/assets";
import Search from "./Search";
import ShopCategorySubMenu from "./ShopCategorySubMenu";
import AccountDropdown from "./AccountDropdown";
import TopBanner from "../homePage/TopBanner";
import { useStateStorage } from "@/utils/stateStorage";
//--Framework--//
import { useState, useEffect, FC } from "react";
import { useRouter, usePathname } from "next/navigation"; // Combined imports
import Image from "next/legacy/image";
import Link from "next/link";
//---Packages---//
import { AppBar, Toolbar, IconButton, Badge } from "@mui/material";
import { Binoculars, Basket, List } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const Header: FC = () => {
	const router = useRouter();
	const pathname = usePathname();
	const [isFirstLoad, setIsFirstLoad] = useState(true);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isShopCategorySubMenuOpen, setIsShopCategorySubMenuOpen] =
		useState(false);
	const [isMobileSubMenuOpen, setIsMobileSubMenuOpen] = useState(false);
	const { state, dispatch } = useStateStorage();
	const { cart, isCartVisible } = state;
	const cartQuantity = cart.cartItems.reduce(
		(acc, item) => acc + item.quantity,
		0
	);

	const toggleMenu = () => {
		console.log("Toggling menu:", !isMenuOpen);
		setIsMenuOpen(!isMenuOpen);
		if (!isMenuOpen) {
			dispatch({ type: "HIDE_CART" });
		}
	};

	const toggleSearch = () => {
		setIsSearchOpen(!isSearchOpen);
	};

	const handleCartClick = () => {
		if (isMenuOpen) {
			setIsMenuOpen(false);
		}
		dispatch({ type: isCartVisible ? "HIDE_CART" : "SHOW_CART" });
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
				<TopBanner />
				<Toolbar className="flex justify-between">
					{isSearchOpen ? (
						<div className="flex-1 flex justify-center">
							<div className="w-full md:w-2/3">
								<Search visible={isSearchOpen} onClose={toggleSearch} />
							</div>
						</div>
					) : (
						<>
							<div className="hidden lg:flex lg:flex-1 justify-start space-x-4 md:text-xl lg:text-2xl">
								<Link
									className={`hover-underline-animation ${pathname === "/" ? "text-emerald-600" : ""}`}
									href="/"
								>
									Home
								</Link>
								<div
									className="relative"
									onMouseEnter={() => setIsShopCategorySubMenuOpen(true)}
									onMouseLeave={() => setIsShopCategorySubMenuOpen(false)}
								>
									<Link
										className={`hover-underline-animation ${pathname === "/shop" ? "text-emerald-600" : ""}`}
										href="/shop"
									>
										Shop
									</Link>
									{isShopCategorySubMenuOpen && (
										<ShopCategorySubMenu
											isVisible={isShopCategorySubMenuOpen}
											onClose={() => setIsShopCategorySubMenuOpen(false)}
										/>
									)}
								</div>
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
							<div className="flex-1 justify-center hidden lg:flex rounded-sm ">
								<Link href="/">
									<Image src={simpleLogo} alt="Logo" width={100} height={100} />
								</Link>
							</div>
							{/* Menu Section */}
							<div className="hidden lg:flex lg:flex-1 justify-end space-x-4">
								<IconButton title="Search" onClick={toggleSearch}>
									<Binoculars className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8" />
								</IconButton>
								<AccountDropdown />
								<IconButton title="Cart" onClick={handleCartClick}>
									<Badge badgeContent={cartQuantity} color="primary">
										<Basket className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8" />
									</Badge>
								</IconButton>
							</div>
							{/* Mobile Menu Section */}
							<div className="lg:hidden flex items-center justify-between w-full mr-[1.5rem]">
								<div className="absolute left-2 flex items-center">
									<IconButton title="Menu" onClick={toggleMenu}>
										<List size={30} />
									</IconButton>
								</div>
								<Link href="/" className="mx-auto">
									<Image src={simpleLogo} alt="Logo" width={80} height={80} />
								</Link>
								<div className="absolute right-2 flex items-center space-x-1">
									<IconButton title="Search" onClick={toggleSearch}>
										<Binoculars size={28} />
									</IconButton>
									<AccountDropdown />
									<IconButton title="Cart" onClick={handleCartClick}>
										<Badge badgeContent={cartQuantity} color="primary">
											<Basket size={28} />
										</Badge>
									</IconButton>
								</div>
							</div>
							{/* Mobile Menu Overlay */}
							{isMenuOpen && (
								<div className="absolute top-full left-0 w-full rounded-b-lg bg-white shadow-md flex flex-col items-left space-y-2 p-4">
									<Link
										href="/"
										className={`p-1 hover:bg-emerald-500 hover:rounded-sm hover:text-primary ${pathname === "/" ? "text-emerald-600" : ""}`}
										onClick={() => setIsMenuOpen(false)}
									>
										Home
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
									<div
										className="relative group"
										onMouseEnter={() => setIsMobileSubMenuOpen(true)}
										onMouseLeave={() => setIsMobileSubMenuOpen(false)}
									>
										<div
											className={`p-1 ${isMobileSubMenuOpen ? "bg-emerald-500 rounded-sm text-primary" : "hover:bg-emerald-500 hover:rounded-sm hover:text-primary"} ${pathname === "/shop" ? "text-emerald-600" : ""}`}
										>
											Shop
										</div>
										{isMobileSubMenuOpen && (
											<ShopCategorySubMenu
												isVisible={isMobileSubMenuOpen}
												onClose={() => {
													setIsMobileSubMenuOpen(false);
													setIsMenuOpen(false);
												}}
											/>
										)}
									</div>
								</div>
							)}
						</>
					)}
				</Toolbar>
			</AppBar>
			{/* Close mobile menu on screen resize */}
			{typeof window !== "undefined" &&
				window.addEventListener("resize", () => {
					if (window.innerWidth >= 768 && isMenuOpen) {
						setIsMenuOpen(false);
					}
				})}
		</>
	);
};

export default Header;
