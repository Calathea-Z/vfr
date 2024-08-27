"use client";
import { FC, useState } from "react";
import dynamic from "next/dynamic";
import {
	ListNumbers,
	AddressBook as AddressBookIcon,
	SignOut,
	ArrowCircleRight,
	ArrowCircleLeft,
} from "@phosphor-icons/react";

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
	const [isNavCollapsed, setIsNavCollapsed] = useState(false);

	return (
		<div className="flex min-h-screen">
			<div
				className={`relative bg-gray-200 p-4 ${isNavCollapsed ? "w-16" : "w-1/4"}`}
			>
				{isNavCollapsed && (
					<button
						title="Expand"
						className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 hover:text-gray-500"
						onClick={() => setIsNavCollapsed(!isNavCollapsed)}
					>
						<ArrowCircleRight size={32} className="hover:fill-gray-500" />
					</button>
				)}
				{!isNavCollapsed && (
					<button
						title="Collapse"
						className="absolute top-0 right-0 mt-2 mr-2 hover:text-gray-500"
						onClick={() => setIsNavCollapsed(!isNavCollapsed)}
					>
						<ArrowCircleLeft size={32} className="hover:fill-gray-500" />
					</button>
				)}
				<ul
					className={`space-y-4 mt-8 ${isNavCollapsed ? "flex flex-col items-center" : ""}`}
				>
					<li
						title="Order History"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => setSelectedOption("OrderHistory")}
					>
						{isNavCollapsed ? (
							<ListNumbers size={32} className="text-gray-700" />
						) : (
							"Order History"
						)}
					</li>
					<li
						title="Address Book"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => setSelectedOption("AddressBook")}
					>
						{isNavCollapsed ? <AddressBookIcon size={32} /> : "Address Book"}
					</li>
					<li
						title="Logout"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
					>
						{isNavCollapsed ? <SignOut size={32} /> : "Logout"}
					</li>
				</ul>
			</div>
			<div className="w-3/4 p-4">
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
