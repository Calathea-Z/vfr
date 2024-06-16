import { handleSignOut } from "../../actions/signOutAction";

interface LogoutButtonProps {
	onLogout: () => void;
}

export default function LogoutButton({
	onLogout,
}: LogoutButtonProps): JSX.Element {
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
}
