"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Using useSession from next-auth
import {
	useReactTable,
	createColumnHelper,
	getCoreRowModel,
	flexRender,
	getSortedRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	getPaginationRowModel,
	SortingState,
} from "@tanstack/react-table";
import {
	CheckCircle,
	CaretUp,
	CaretDown,
	Leaf,
	ShoppingCart,
	Users,
} from "@phosphor-icons/react"; // Importing Phosphor Icons

const AdminDashboard = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true); // State to manage loading
	const [sorting, setSorting] = useState<SortingState>([]); // State to manage sorting
	const [selectedOption, setSelectedOption] = useState<string | null>(
		"OrderHistory"
	);
	const [isNavCollapsed, setIsNavCollapsed] = useState(false); // State to manage nav collapse

	useEffect(() => {
		if (status === "loading") return; // Do nothing while loading
		if (status === "unauthenticated" || session?.user?.role !== "admin") {
			router.push("/"); // Redirect non-admin users to the home page
		} else {
			fetchOrderData();
		}
	}, [session, status]);

	const fetchOrderData = async () => {
		setLoading(true); // Set loading to true before fetching data
		const response = await fetch("/api/orders/get-all-orders");
		const data = await response.json();
		setOrders(data);
		setLoading(false); // Set loading to false after data is fetched
	};

	const handleToggle = async (orderId: any) => {
		await fetch(`/api/orders/update-order-status`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ orderId, shipped: true }),
		});
		fetchOrderData();
	};

	const columnHelper = createColumnHelper<any>();

	const columns = [
		columnHelper.accessor("createdAt", {
			header: () => "Created At",
			cell: (info) => {
				const createdAt = new Date(info.getValue());
				return createdAt.toLocaleDateString();
			},
			enableSorting: true,
		}),
		columnHelper.accessor("customer", {
			header: () => "Customer",
			cell: (info) => {
				const customer = info.getValue();
				return (
					<div className="text-sm font-medium text-gray-900">
						{customer.name} ({customer.email})
					</div>
				);
			},
			enableSorting: true,
		}),
		columnHelper.accessor("customer.address", {
			header: () => "Address",
			cell: (info) => {
				const address = info.getValue();
				return (
					<div className="text-sm text-gray-900">
						{address.street}, {address.city}, {address.state} {address.zipCode}
					</div>
				);
			},
			enableSorting: true,
		}),
		columnHelper.accessor("shippingStatus", {
			header: () => "Shipping Status",
			cell: (info) => {
				const status = "Shipped";
				return (
					<span
						className={`px-2 py-1 rounded-full text-sm text-white ${
							status === "Shipped" ? "bg-gray-700" : "bg-gray-400"
						}`}
					>
						{status}
					</span>
				);
			},
			enableSorting: true,
		}),
		columnHelper.accessor("_id", {
			header: () => "ID",
			cell: (info) => (
				<div className="text-sm text-gray-900">{info.getValue()}</div>
			),
			enableSorting: true,
		}),
		columnHelper.accessor("fees.total", {
			header: () => "Total",
			cell: (info) => {
				const total = info.getValue();
				return (
					<div className="text-sm text-gray-900">
						{total !== undefined ? `$${total.toFixed(2)}` : "N/A"}
					</div>
				);
			},
			enableSorting: true,
		}),
		columnHelper.accessor("items", {
			header: () => "Items",
			cell: (info) => {
				const items = info.getValue();
				return (
					<div className="text-sm text-gray-900">
						{items.map((item: any) => (
							<div key={item._id}>
								{item.name} - {item.quantity}
							</div>
						))}
					</div>
				);
			},
			enableSorting: true,
		}),
		columnHelper.display({
			id: "action",
			header: () => "Action",
			cell: ({ row }) => (
				<button
					className="bg-gray-700 text-white px-4 py-2 rounded flex items-center text-sm"
					onClick={() => handleToggle(row.original._id)}
				>
					<CheckCircle weight="bold" className="mr-2" />
					Mark as Shipped
				</button>
			),
		}),
	];

	const table = useReactTable({
		data: orders,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	});

	return (
		<div className="flex min-h-screen">
			<div className="relative bg-gray-200 p-2 w-16 flex flex-col items-center">
				<ul className="space-y-4 mt-8">
					<li
						title="Orders"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => setSelectedOption("OrderHistory")}
					>
						<ShoppingCart size={32} className="text-gray-700" />
					</li>
					<li
						title="Customers"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => setSelectedOption("Customers")}
					>
						<Users size={32} />
					</li>
					<li
						title="Sanity Studio"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => window.open("/admin/studio", "_blank")}
					>
						<Leaf size={32} />
					</li>
				</ul>
			</div>
			<div className="w-full p-4">
				{loading ? (
					<div className="flex justify-center items-center h-full">
						<div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
					</div>
				) : (
					<div className="overflow-x-auto bg-white shadow-md rounded-lg h-full">
						<div className="w-full overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200 h-full">
								<thead className="bg-gray-700">
									{table.getHeaderGroups().map((headerGroup) => (
										<tr key={headerGroup.id}>
											{headerGroup.headers.map((header) => (
												<th
													key={header.id}
													colSpan={header.colSpan}
													className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer"
													onClick={header.column.getToggleSortingHandler()}
												>
													<div className="flex items-center">
														{header.isPlaceholder
															? null
															: flexRender(
																	header.column.columnDef.header,
																	header.getContext()
																)}
														{!header.column.getIsSorted() && (
															<div className="ml-2 bg-gray-500 text-white rounded-md px-2 py-1 text-xs">
																SORT
															</div>
														)}
														{header.column.getIsSorted() ? (
															<div className="ml-2 bg-gray-400 text-white rounded-full p-1">
																{header.column.getIsSorted() === "desc" ? (
																	<CaretDown size={16} />
																) : (
																	<CaretUp size={16} />
																)}
															</div>
														) : null}
													</div>
												</th>
											))}
										</tr>
									))}
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{table.getRowModel().rows.map((row) => (
										<tr key={row.id}>
											{row.getVisibleCells().map((cell) => (
												<td
													key={cell.id}
													className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="flex justify-between items-center p-4">
							<button
								className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</button>
							<span className="text-sm text-gray-900">
								Page{" "}
								<strong>
									{table.getState().pagination.pageIndex + 1} of{" "}
									{table.getPageCount()}
								</strong>
							</span>
							<button
								className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								Next
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminDashboard;
