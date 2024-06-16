import { signOut } from "@/nextAuth";

export default function LogoutPage(): JSX.Element {
	return (
		<div className="flex items-start justify-center h-screen bg-primary">
			<div className="block max-w-sm p-10 bg-primary border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center mt-10">
				<h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white flex flex-row justify-center items-center gap-2">
					Are you sure you want to sign out?
				</h3>
				<form
					action={async (formData) => {
						"use server";
						await signOut({ redirectTo: "/" });
					}}
				>
					<button
						type="submit"
						className="font-lg rounded-md bg-zinc-100 hover:bg-zinc-200 cursor-pointer p-4"
					>
						Sign Out
					</button>
				</form>
			</div>
		</div>
	);
}
