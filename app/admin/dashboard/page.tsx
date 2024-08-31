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
	House,
	ShoppingCart,
	Package,
	Users,
} from "@phosphor-icons/react"; // Importing Phosphor Icons

const AdminDashboard = () => {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true); // State to manage loading
	const [sorting, setSorting] = useState<SortingState>([]); // State to manage sorting
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
				return `${customer.name} (${customer.email})`;
			},
			enableSorting: true,
		}),
		columnHelper.accessor("customer.address", {
			header: () => "Address",
			cell: (info) => {
				const address = info.getValue();
				return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
			},
			enableSorting: true,
		}),
		columnHelper.accessor("shippingStatus", {
			header: () => "Shipping Status",
			cell: (info) => {
				const status = "Shipped";
				return (
					<span
						className={`px-2 py-1 rounded-full text-white ${
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
			cell: (info) => info.getValue(),
			enableSorting: true,
		}),
		columnHelper.accessor("fees.total", {
			header: () => "Total",
			cell: (info) => {
				const total = info.getValue();
				return total !== undefined ? `$${total.toFixed(2)}` : "N/A";
			},
			enableSorting: true,
		}),
		columnHelper.accessor("items", {
			header: () => "Items",
			cell: (info) => {
				const items = info.getValue();
				return items.map((item: any) => (
					<div key={item._id}>
						{item.name} - {item.quantity}
					</div>
				));
			},
			enableSorting: true,
		}),
		columnHelper.display({
			id: "action",
			header: () => "Action",
			cell: ({ row }) => (
				<button
					className="bg-gray-700 text-white px-4 py-2 rounded flex items-center"
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
		<div
			className="min-h-screen flex overflow-hidden"
			style={{ backgroundColor: "#F5F5F5" }}
		>
			<div
				className={`bg-gray-700 text-white p-4 ${isNavCollapsed ? "w-16" : "w-64"} transition-width duration-300`}
			>
				<button onClick={() => setIsNavCollapsed(!isNavCollapsed)}>
					{isNavCollapsed ? "Expand" : "Collapse"}
				</button>
				{!isNavCollapsed && (
					<nav>
						<ul>
							<li className="flex items-center">
								<House size={24} className="mr-2" />
								Dashboard
							</li>
							<li className="flex items-center">
								<ShoppingCart size={24} className="mr-2" />
								Orders
							</li>
							<li className="flex items-center">
								<Package size={24} className="mr-2" />
								Products
							</li>
							<li className="flex items-center">
								<Users size={24} className="mr-2" />
								Customers
							</li>
						</ul>
					</nav>
				)}
				{isNavCollapsed && (
					<nav>
						<ul>
							<li>
								<House size={24} />
							</li>
							<li>
								<ShoppingCart size={24} />
							</li>
							<li>
								<Package size={24} />
							</li>
							<li>
								<Users size={24} />
							</li>
						</ul>
					</nav>
				)}
			</div>
			<div className="flex-grow flex flex-col">
				<header className="bg-gray-700 text-white flex justify-between items-center h-12 p-2 w-full">
					<h1 className="text-lg font-bold">Order Dashboard</h1>
					<button className="bg-gray-400 text-white px-4 py-2 rounded">
						Log Out
					</button>
				</header>
				<main className="flex-grow w-full p-4 overflow-auto">
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
														className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700"
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
									className="bg-gray-700 text-white px-4 py-2 rounded"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
								>
									Previous
								</button>
								<span>
									Page{" "}
									<strong>
										{table.getState().pagination.pageIndex + 1} of{" "}
										{table.getPageCount()}
									</strong>
								</span>
								<button
									className="bg-gray-700 text-white px-4 py-2 rounded"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
								>
									Next
								</button>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default AdminDashboard;
