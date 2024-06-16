"use client";
import { handleSignOut } from "../../actions/signOutAction";
//---Framework---//
import { useState, MouseEvent } from "react";
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
			<IconButton onClick={handleClick}>
				{session?.user?.image ? (
					<Avatar
						src={session.user.image ?? undefined}
						alt={session.user.name ?? undefined}
						sx={{ width: { xs: 24, md: 40 }, height: { xs: 24, md: 40 } }}
					/>
				) : (
					<UserCircle className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8" />
				)}
			</IconButton>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{session ? (
					<>
						<MenuItem disabled>
							<span className="font-bold text-black text-xl">
								Hi, {session?.user?.name?.split(" ")[0]}
							</span>
						</MenuItem>
						<MenuItem onClick={() => handleNavigate("/userDashboard")}>
							<GearSix className="w-5 h-5" />
							&nbsp;Account
						</MenuItem>
						<MenuItem onClick={handleLogout}>
							<HandWaving className="w-5 h-5" />
							&nbsp;Logout
						</MenuItem>
					</>
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
