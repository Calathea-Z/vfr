import { handleSignOut } from "../../actions/signOutAction";
//---Framework---//
import { FC } from "react";

interface LogoutButtonProps {
	onLogout: () => void;
}

const LogoutButton: FC<LogoutButtonProps> = ({ onLogout }) => {
	return (
		<form
			action={async (formData) => {
				await handleSignOut();
				onLogout();
			}}
		>
			<button
				type="submit"
				className="font-lg rounded-md bg-zinc-100 hover:bg-zinc-200 cursor-pointer p-4"
			>
				Sign Out
			</button>
		</form>
	);
};

export default LogoutButton;
