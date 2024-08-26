"use client";
import { FC, useState } from "react";
import dynamic from "next/dynamic";
import {
	ListNumbers,
	AddressBook,
	SignOut,
	ArrowCircleRight,
	ArrowCircleLeft,
} from "@phosphor-icons/react";

const OrderHistory = dynamic(
	() => import("../../components/userAccount/OrderHistory")
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
				<button
					className="absolute top-0 right-0 mt-2 mr-2 hover:text-gray-500"
					onClick={() => setIsNavCollapsed(!isNavCollapsed)}
				>
					{isNavCollapsed ? (
						<ArrowCircleRight size={24} className="hover:fill-gray-500" />
					) : (
						<ArrowCircleLeft size={32} className="hover:fill-gray-500" />
					)}
				</button>
				<ul className="space-y-4 mt-8">
					<li
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => setSelectedOption("OrderHistory")}
					>
						{isNavCollapsed ? (
							<ListNumbers size={32} className="text-gray-700" />
						) : (
							"Order History"
						)}
					</li>
					<li className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center">
						{isNavCollapsed ? <AddressBook size={32} /> : "Address Book"}
					</li>
					<li className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center">
						{isNavCollapsed ? <SignOut size={32} /> : "Logout"}
					</li>
				</ul>
			</div>
			<div className="w-3/4 p-4">
				{selectedOption === "OrderHistory" ? (
					<OrderHistory />
				) : (
					<h1>Welcome to your dashboard</h1>
				)}
			</div>
		</div>
	);
};

export default UserAccountDashboard;
