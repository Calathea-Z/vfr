"use client";
import { FC, useState } from "react";
import dynamic from "next/dynamic";
import {
	ListNumbers,
	AddressBook as AddressBookIcon,
	SignOut,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { handleSignOut } from "@/app/actions/signOutAction";

const OrderHistory = dynamic(
	() => import("../../components/userAccount/OrderHistory")
);

const AddressBook = dynamic(
	() => import("../../components/userAccount/AddressBook")
);

const UserAccountDashboard: FC = () => {
	const [selectedOption, setSelectedOption] = useState<string | null>(
		"OrderHistory"
	);
	const router = useRouter();
	const { data: session, update } = useSession();
	const { enqueueSnackbar } = useSnackbar();

	const handleLogout = async () => {
		try {
			await handleSignOut();
			enqueueSnackbar("Successfully logged out", { variant: "success" });
			await update(); // Recheck the session state
			router.push("/"); // Redirect to home page
		} catch (error) {
			enqueueSnackbar("Failed to log out", { variant: "error" });
		}
	};

	return (
		<div className="flex min-h-screen">
			<div className="relative bg-gray-200 p-2 w-16 flex flex-col items-center">
				<ul className="space-y-4 mt-8">
					<li
						title="Order History"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => setSelectedOption("OrderHistory")}
					>
						<ListNumbers size={32} className="text-gray-700" />
					</li>
					<li
						title="Address Book"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => setSelectedOption("AddressBook")}
					>
						<AddressBookIcon size={32} />
					</li>
					<li
						title="Logout"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={handleLogout}
					>
						<SignOut size={32} />
					</li>
				</ul>
			</div>
			<div className="w-full p-4">
				{selectedOption === "OrderHistory" ? (
					<OrderHistory />
				) : selectedOption === "AddressBook" ? (
					<AddressBook />
				) : (
					<h1>Welcome to your dashboard</h1>
				)}
			</div>
		</div>
	);
};

export default UserAccountDashboard;
