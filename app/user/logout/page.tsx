"use client";

import { useSnackbar } from "notistack";
import LogoutButton from "../../components/auth/LogOutButton";

export default function LogoutPage() {
	const { enqueueSnackbar } = useSnackbar();

	const handleLogout = () => {
		enqueueSnackbar("Successfully logged out", { variant: "success" });
	};

	return (
		<div>
			<h1>Logout</h1>
			<LogoutButton onLogout={handleLogout} />
		</div>
	);
}
