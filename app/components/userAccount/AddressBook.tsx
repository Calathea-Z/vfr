import React, { useState, useEffect, useRef } from "react";
import { Address } from "../../../types/types";
import {
	Button,
	IconButton,
	Modal,
	FormControl,
	InputLabel,
	Input,
	FormControlLabel,
	Checkbox,
	Switch,
	Select,
	MenuItem,
	CircularProgress,
} from "@mui/material";
import { PencilSimple, Plus, TrashSimple } from "@phosphor-icons/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import states from "states-us";

const AddressBook: React.FC = () => {
	const { data: session } = useSession();
	const userId = session?.user?.id;

	const [addresses, setAddresses] = useState<Address[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) return;

		// Fetch user addresses from the server
		const fetchAddresses = async () => {
			setLoading(true);
			const response = await axios.get(
				`/api/user-address/get-addresses/${userId}`
			);
			setAddresses(response.data);
			setLoading(false);
		};

		fetchAddresses();
	}, [userId]);

	const handleAddNewAddress = () => {
		setCurrentAddress(null);
		setIsModalVisible(true);
	};

	const handleEditAddress = (address: Address) => {
		setCurrentAddress(address);
		setIsModalVisible(true);
	};

	const handleSetPrimary = async (addressId: string | undefined) => {
		if (!addressId) return;
		await axios.patch(
			`/api/user-address/set-primary-address/${addressId}`,
			null,
			{
				headers: { userId },
			}
		);
		// Refresh addresses after setting primary
		const response = await axios.get(
			`/api/user-address/get-addresses/${userId}`
		);
		setAddresses(response.data);
	};

	const handleDeleteAddress = async (addressId: string | undefined) => {
		if (!addressId) return;
		await axios.delete(`/api/user-address/delete-address/${addressId}`, {
			headers: { userId },
		});
		// Refresh addresses after deleting
		const response = await axios.get(
			`/api/user-address/get-addresses/${userId}`
		);
		setAddresses(response.data);
	};

	const handleModalOk = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const values: Address = {
			_id: currentAddress?._id || "",
			company: formData.get("company") as string,
			street: formData.get("street") as string,
			streetTwo: formData.get("streetTwo") as string,
			city: formData.get("city") as string,
			state: formData.get("state") as string,
			zipCode: formData.get("zipCode") as string,
			phoneNumber: formData.get("phoneNumber") as string,
			isPrimary: formData.get("isPrimary") === "on",
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
		};

		try {
			if (currentAddress) {
				// Update existing address
				await axios.put(
					`/api/user-address/update-address/${currentAddress._id}`,
					values,
					{ headers: { userId } }
				);
			} else {
				// Add new address
				await axios.put(`/api/user-address/add-address/${userId}`, values);
			}
			setIsModalVisible(false);
			// Refresh addresses after adding/updating
			const response = await axios.get(
				`/api/user-address/get-addresses/${userId}`
			);
			setAddresses(response.data);
		} catch (error) {
			console.error("Error adding/updating address:", error);
		}
	};

	const handleModalCancel = () => {
		setIsModalVisible(false);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-full">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div>
			<div className="flex flex-wrap gap-6 mt-6">
				{addresses.map((address) => (
					<div
						key={address._id}
						className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md"
					>
						<div className="flex flex-col h-full justify-between">
							<div className="flex justify-between items-start">
								<h2 className="text-xl font-semibold mb-2">{`${address.firstName} ${address.lastName}`}</h2>
								<FormControlLabel
									control={
										<Switch
											checked={address.isPrimary}
											onChange={() => handleSetPrimary(address._id)}
											color="success"
										/>
									}
									label={address.isPrimary ? "Primary" : "Set as Primary"}
								/>
							</div>
							<div>
								<p className="text-gray-600">{address.company}</p>
								<p className="text-gray-600">{address.street}</p>
								<p className="text-gray-600">{address.streetTwo}</p>
								<p className="text-gray-600">
									{address.city}, {address.state} {address.zipCode}
								</p>
								<p className="text-gray-600">{address.phoneNumber}</p>
							</div>
							<div className="flex justify-end gap-2 mt-4">
								<IconButton
									onClick={() => handleEditAddress(address)}
									style={{
										backgroundColor: "blue",
										color: "white",
										borderRadius: "50%",
										cursor: "pointer",
									}}
									title="Edit"
								>
									<PencilSimple />
								</IconButton>
								<IconButton
									onClick={() => handleDeleteAddress(address._id)}
									style={{
										backgroundColor: "red",
										color: "white",
										borderRadius: "50%",
										cursor: "pointer",
									}}
									title="Delete"
								>
									<TrashSimple />
								</IconButton>
							</div>
						</div>
					</div>
				))}
				<div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
					<h2 className="text-xl font-semibold mb-2 text-center">
						Add an address
					</h2>
					<IconButton
						onClick={handleAddNewAddress}
						style={{
							backgroundColor: "green",
							color: "white",
							borderRadius: "50%",
							cursor: "pointer",
							marginTop: "10px",
						}}
					>
						<Plus />
					</IconButton>
				</div>
			</div>
			<Modal open={isModalVisible} onClose={handleModalCancel}>
				<div className="p-6 bg-white rounded-lg shadow-md mx-auto my-20 w-96">
					<h2 className="text-2xl font-semibold mb-6">
						{currentAddress ? "Edit Address" : "Add New Address"}s
					</h2>
					<form onSubmit={handleModalOk}>
						<FormControl fullWidth margin="normal">
							<InputLabel htmlFor="firstName">First Name</InputLabel>
							<Input
								id="firstName"
								name="firstName"
								defaultValue={currentAddress?.firstName || ""}
								required
							/>
						</FormControl>
						<FormControl fullWidth margin="normal">
							<InputLabel htmlFor="lastName">Last Name</InputLabel>
							<Input
								id="lastName"
								name="lastName"
								defaultValue={currentAddress?.lastName || ""}
								required
							/>
						</FormControl>
						<FormControl fullWidth margin="normal">
							<InputLabel htmlFor="company">Company</InputLabel>
							<Input
								id="company"
								name="company"
								defaultValue={currentAddress?.company || ""}
							/>
						</FormControl>
						<FormControl fullWidth margin="normal">
							<InputLabel htmlFor="street">Street</InputLabel>
							<Input
								id="street"
								name="street"
								defaultValue={currentAddress?.street || ""}
								required
							/>
						</FormControl>
						<FormControl fullWidth margin="normal">
							<InputLabel htmlFor="streetTwo">Street Two</InputLabel>
							<Input
								id="streetTwo"
								name="streetTwo"
								defaultValue={currentAddress?.streetTwo || ""}
							/>
						</FormControl>
						<FormControl fullWidth margin="normal">
							<InputLabel htmlFor="city">City</InputLabel>
							<Input
								id="city"
								name="city"
								defaultValue={currentAddress?.city || ""}
								required
							/>
						</FormControl>
						<FormControl fullWidth margin="normal" error={false}>
							<InputLabel
								htmlFor="state"
								style={{ fontSize: "0.9rem", marginTop: ".4rem" }}
							>
								State
							</InputLabel>
							<Select
								id="state"
								name="state"
								defaultValue={currentAddress?.state || ""}
								required
								style={{
									fontSize: ".9rem",
									paddingBottom: ".1rem",
									marginTop: ".6rem",
								}}
								MenuProps={{
									anchorOrigin: {
										vertical: "bottom",
										horizontal: "left",
									},
									transformOrigin: {
										vertical: "top",
										horizontal: "left",
									},
								}}
							>
								{states.map((state) => (
									<MenuItem
										key={state.abbreviation}
										value={state.abbreviation}
										style={{ fontSize: "0.9rem" }}
									>
										{state.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl fullWidth margin="normal">
							<InputLabel htmlFor="zipCode">Zip Code</InputLabel>
							<Input
								id="zipCode"
								name="zipCode"
								defaultValue={currentAddress?.zipCode || ""}
								required
							/>
						</FormControl>
						<FormControl fullWidth margin="normal">
							<InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
							<Input
								id="phoneNumber"
								name="phoneNumber"
								defaultValue={currentAddress?.phoneNumber || ""}
								required
							/>
						</FormControl>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: "10px",
							}}
						>
							<FormControlLabel
								control={
									<Checkbox
										name="isPrimary"
										defaultChecked={currentAddress?.isPrimary || false}
									/>
								}
								label="Set as Primary"
							/>
							<Button
								type="submit"
								variant="contained"
								style={{ backgroundColor: "green", color: "white" }}
							>
								{currentAddress ? "Update Address" : "Add Address"}
							</Button>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	);
};

export default AddressBook;
