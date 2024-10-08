"use client";
import { handleSignOut } from "../../actions/signOutAction";
import { SessionUser } from "@/types/types";
//---Framework---//
import { useState, MouseEvent, useRef, FC } from "react";
import { useRouter } from "next/navigation";
//---Packages---//
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import {
	UserCircle,
	GearSix,
	HandWaving,
	Storefront,
} from "@phosphor-icons/react";
import { useSnackbar } from "notistack";
import { useSession } from "next-auth/react";

const AccountDropdown: FC = () => {
	const { data: session, status, update } = useSession();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleNavigate = (url: string) => {
		router.push(url);
		handleClose();
	};

	const handleLogout = async () => {
		try {
			await handleSignOut();
			enqueueSnackbar("Successfully logged out", { variant: "success" });
			await update(); // Recheck the session state
			router.push("/");
			window.location.reload(); // Force page reload to clear login state
		} catch (error) {
			enqueueSnackbar("Failed to log out", { variant: "error" });
		} finally {
			handleClose();
		}
	};

	return (
		<>
			<IconButton title="My Account" ref={buttonRef} onClick={handleClick}>
				{session?.user ? (
					<Avatar
						src={(session.user as SessionUser).image ?? undefined}
						alt={(session.user as SessionUser).name ?? undefined}
						sx={{ width: { xs: 20, md: 36 }, height: { xs: 20, md: 36 } }}
					/>
				) : (
					<UserCircle className="w-7 h-7 lg:w-8 lg:h-8" />
				)}
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				sx={{ zIndex: 9999 }}
			>
				{session ? (
					[
						<MenuItem key="greeting" disabled>
							<span className="font-bold text-black text-xl">
								Hi, {(session?.user as SessionUser)?.name?.split(" ")[0]}
							</span>
						</MenuItem>,
						<MenuItem
							key="account"
							onClick={() => handleNavigate("/user/account")}
						>
							<GearSix className="w-5 h-5" />
							&nbsp;Account
						</MenuItem>,
						(session.user as SessionUser)?.role === "admin" && (
							<MenuItem
								key="admin"
								onClick={() => handleNavigate("/admin/dashboard")}
							>
								<Storefront className="w-5 h-5" />
								&nbsp;MyShop
							</MenuItem>
						),
						<MenuItem key="logout" onClick={handleLogout}>
							<HandWaving className="w-5 h-5" />
							&nbsp;Logout
						</MenuItem>,
					]
				) : (
					<MenuItem onClick={() => handleNavigate("/user/login")}>
						Log In
					</MenuItem>
				)}
			</Menu>
		</>
	);
};

export default AccountDropdown;
