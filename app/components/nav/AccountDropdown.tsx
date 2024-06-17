"use client";
import { handleSignOut } from "../../actions/signOutAction";
//---Framework---//
import { useState, MouseEvent, useRef } from "react";
import { useRouter } from "next/navigation";
//---Packages---//
import { IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { UserCircle, GearSix, HandWaving } from "@phosphor-icons/react";
import { useSnackbar } from "notistack";
import { useSession } from "next-auth/react";

const AccountDropdown = () => {
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
			<IconButton ref={buttonRef} onClick={handleClick}>
				{session?.user?.image ? (
					<Avatar
						src={session.user.image ?? undefined}
						alt={session.user.name ?? undefined}
						sx={{ width: { xs: 24, md: 36 }, height: { xs: 24, md: 36 } }}
					/>
				) : (
					<UserCircle className="w-7 h-7 lg:w-8 lg:h-8" />
				)}
			</IconButton>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{session ? (
					[
						<MenuItem key="greeting" disabled>
							<span className="font-bold text-black text-xl">
								Hi, {session?.user?.name?.split(" ")[0]}
							</span>
						</MenuItem>,
						<MenuItem
							key="account"
							onClick={() => handleNavigate("/userDashboard")}
						>
							<GearSix className="w-5 h-5" />
							&nbsp;Account
						</MenuItem>,
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
