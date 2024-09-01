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
	SortAscending,
	FunnelSimple,
	XCircle,
	SortDescending,
	Stack,
	House,
	SignOut,
} from "@phosphor-icons/react"; // Importing Phosphor Icons
import Switch from "@mui/material/Switch"; // Importing MUI Switch
import IconButton from "@mui/material/IconButton"; // Importing MUI IconButton
import Tooltip from "@mui/material/Tooltip"; // Importing MUI Tooltip
import { handleSignOut } from "@/app/actions/signOutAction"; // Importing signOutAction
import { useSnackbar } from "notistack"; // Importing useSnackbar from notistack

const AdminDashboard = () => {
	const router = useRouter();
	const { data: session, status, update } = useSession();
	const { enqueueSnackbar } = useSnackbar();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true); // State to manage loading
	const [sorting, setSorting] = useState<SortingState>([]); // State to manage sorting
	const [selectedOption, setSelectedOption] = useState<string | null>(
		"OrderHistory"
	);
	const [isNavCollapsed, setIsNavCollapsed] = useState(false); // State to manage nav collapse
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set()); // State to manage expanded rows

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

	const handleToggle = async (orderId: any, shipped: boolean) => {
		await fetch(`/api/orders/set-shipped-status/${orderId}/${shipped}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ orderId, shipped }),
		});
		fetchOrderData();
	};

	const handleRowClick = (rowId: string) => {
		setExpandedRows((prev) => {
			const newExpandedRows = new Set(prev);
			if (newExpandedRows.has(rowId)) {
				newExpandedRows.delete(rowId);
			} else {
				newExpandedRows.add(rowId);
			}
			return newExpandedRows;
		});
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
		}
	};

	const columnHelper = createColumnHelper<any>();

	const columns = [
		// Arrow column for expanding/collapsing rows
		columnHelper.display({
			id: "expander",
			cell: ({ row }) => (
				<Tooltip title="More details">
					<IconButton
						onClick={(e) => {
							e.stopPropagation();
							handleRowClick(row.id);
						}}
						className="cursor-pointer text-lg font-bold"
					>
						{expandedRows.has(row.id) ? (
							<CaretDown size={20} />
						) : (
							<CaretUp size={20} />
						)}
					</IconButton>
				</Tooltip>
			),
			size: 10, // Size for the arrow column
		}),
		// Shipped column with smaller size
		columnHelper.accessor("shippingStatus", {
			header: () => "Shipped",
			cell: (info) => {
				const status = info.getValue();
				const orderId = info.row.original._id;
				const shipped = status === "Shipped";
				return (
					<div className="flex items-center">
						{shipped ? (
							<CheckCircle size={20} className="text-green-500 mr-2" />
						) : (
							<XCircle size={20} className="text-red-500 mr-2" />
						)}
						<Tooltip title="Change Shipping Status">
							<Switch
								checked={shipped}
								onChange={() => handleToggle(orderId, !shipped)}
								color="primary"
							/>
						</Tooltip>
					</div>
				);
			},
			enableSorting: true,
			size: 80, // Smaller size
		}),
		// Other columns with smaller default size
		columnHelper.accessor("createdAt", {
			header: () => "Date",
			cell: (info) => {
				const createdAt = new Date(info.getValue());
				return createdAt.toLocaleDateString();
			},
			enableSorting: true,
			size: 80, // Smaller size
		}),
		// Customer column with larger size
		columnHelper.accessor("customer", {
			header: () => "Customer",
			cell: (info) => {
				const customer = info.getValue();
				return (
					<div className="text-sm font-medium text-gray-900">
						{customer.name}
						<br />
						<span className="text-gray-600">{customer.email}</span>
					</div>
				);
			},
			enableSorting: true,
			size: 150, // Larger size
		}),
		// Address column with larger size
		columnHelper.accessor("customer.address", {
			header: () => "Address",
			cell: (info) => {
				const address = info.getValue();
				return (
					<div className="text-sm text-gray-900">
						{address.street}
						<br />
						{address.city} {address.state}
						<br />
						{address.zipCode}
					</div>
				);
			},
			enableSorting: true,
			size: 150, // Larger size
		}),
		// Total column with smaller size
		columnHelper.accessor("fees.total", {
			header: () => "Total",
			cell: (info) => {
				const total = info.getValue();
				return (
					<div className="text-base text-gray-900">
						{total !== undefined ? `$${total.toFixed(2)}` : "N/A"}
					</div>
				);
			},
			enableSorting: true,
			size: 80, // Smaller size
		}),
		// ID column with smaller size
		columnHelper.accessor("_id", {
			header: () => "ID",
			cell: (info) => (
				<div className="text-base text-gray-900">{info.getValue()}</div>
			),
			enableSorting: true,
			size: 100, // Smaller size
		}),
	];

	const table = useReactTable({
		data: orders,
		columns,
		defaultColumn: {
			size: 80, // Default smaller size for all columns
			minSize: 50,
			maxSize: 150,
		},
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
						title="Home"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => router.push("/")}
					>
						<House size={32} className="text-gray-700" />
					</li>
					<li
						title="Orders"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => setSelectedOption("OrderHistory")}
					>
						<Stack size={32} className="text-gray-700" />
					</li>
					<li
						title="Sanity Studio"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={() => window.open("/admin/studio", "_blank")}
					>
						<Leaf size={32} />
					</li>
					<li
						title="Logout"
						className="cursor-pointer hover:bg-gray-300 p-2 rounded-full flex justify-center items-center"
						onClick={handleLogout}
					>
						<SignOut size={32} className="text-gray-700" />
					</li>
				</ul>
			</div>
			<div className="w-full p-4">
				{loading ? (
					<div className="flex justify-center items-center h-full">
						<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
					</div>
				) : (
					<div className="overflow-x-auto bg-white shadow-md rounded-lg h-full">
						<div className="w-full overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200 h-full text-sm md:text-base">
								<thead className="bg-gray-700">
									{table.getHeaderGroups().map((headerGroup) => (
										<tr key={headerGroup.id}>
											{headerGroup.headers.map((header) => (
												<th
													key={header.id}
													colSpan={header.colSpan}
													className="px-2 md:px-6 py-1 md:py-3 text-left font-semibold text-white uppercase tracking-wider cursor-pointer"
													onClick={header.column.getToggleSortingHandler()}
												>
													<div className="flex items-center">
														{header.isPlaceholder
															? null
															: flexRender(
																	header.column.columnDef.header,
																	header.getContext()
																)}
														{header.id !== "expander" &&
															!header.column.getIsSorted() && (
																<FunnelSimple
																	size={16}
																	className="ml-2 text-white"
																/>
															)}
														{header.column.getIsSorted() ? (
															<div className="ml-2 bg-gray-400 text-white rounded-full p-0.5 md:p-1">
																{header.column.getIsSorted() === "desc" ? (
																	<SortDescending size={12} />
																) : (
																	<SortAscending size={12} />
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
										<React.Fragment key={row.id}>
											<tr
												className={`cursor-pointer ${
													expandedRows.has(row.id)
														? "bg-gray-100"
														: "hover:bg-gray-100"
												}`}
											>
												{row.getVisibleCells().map((cell, index) => (
													<td
														key={cell.id}
														className={`px-2 md:px-6 py-1 md:py-4 whitespace-nowrap text-sm md:text-base font-medium text-gray-900 ${index === 0 ? "cursor-pointer" : ""}`}
														onClick={
															index === 0
																? () => handleRowClick(row.id)
																: undefined
														}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</td>
												))}
											</tr>
											{expandedRows.has(row.id) && (
												<tr>
													<td
														colSpan={columns.length}
														className="px-2 md:px-6 py-1 md:py-4 bg-gray-100"
													>
														<div className="text-base text-gray-900">
															<strong>Items Ordered:</strong>
															<ul className="list-disc pl-5">
																{row.original.items.map((item: any) => (
																	<li
																		key={item._id}
																		className="flex items-center"
																	>
																		<span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
																			{item.quantity}
																		</span>
																		{item.name}
																	</li>
																))}
															</ul>
														</div>
													</td>
												</tr>
											)}
										</React.Fragment>
									))}
								</tbody>
							</table>
						</div>
						<div className="flex justify-between items-center p-2 md:p-4">
							<button
								className="bg-gray-700 text-white px-2 md:px-4 py-1 md:py-2 rounded text-xs md:text-sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</button>
							<span className="text-xs md:text-sm text-gray-900">
								Page{" "}
								<strong>
									{table.getState().pagination.pageIndex + 1} of{" "}
									{table.getPageCount()}
								</strong>
							</span>
							<button
								className="bg-gray-700 text-white px-2 md:px-4 py-1 md:py-2 rounded text-xs md:text-sm"
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
