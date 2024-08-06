"use client";
import { Address } from "@/types/types";
//---Framework---//
import React, { useState, useEffect, useRef, FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { useStateStorage } from "../../../utils/stateStorage";
import axios from "axios";
//---Packages---//
import {
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	FormHelperText,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import states from "states-us";
import MaskedInput from "react-text-mask";

type FormFields = {
	firstName: string;
	lastName: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
};

interface DeliveryAddressFormProps {
	setPostalCode: (code: string) => void;
	setIsDeliveryFormFilled: (filled: boolean) => void;
	enqueueSnackbar: (message: string, options?: any) => void;
}

const DeliveryAddressForm: FC<DeliveryAddressFormProps> = ({
	setPostalCode,
	setIsDeliveryFormFilled,
	enqueueSnackbar,
}) => {
	const { dispatch, state } = useStateStorage();
	const {
		control,
		watch,
		formState: { errors },
		setValue,
	} = useForm();

	const [suggestedAddress, setSuggestedAddress] = useState<Address | null>(
		null
	);
	const [isValid, setIsValid] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);

	const validateAddress = async (data: any) => {
		console.log("Validating address:", data);
		try {
			const res = await axios.post("/api/address-validation", data);
			console.log("Validation response:", res.data);
			if (res.data.valid) {
				setIsValid(true);
				setSuggestedAddress(null);
			} else {
				setIsValid(false);
				if (res.data.suggestedAddress) {
					setSuggestedAddress(res.data.suggestedAddress);
					setOpenDialog(true);
				} else {
					enqueueSnackbar("Invalid address. Please check and try again.", {
						variant: "warning",
					});
				}
			}
		} catch (error) {
			console.error("Error validating address", error);
			enqueueSnackbar("Error validating address. Please try again.", {
				variant: "error",
			});
			setIsValid(false);
		}
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleUseSuggestedAddress = () => {
		if (suggestedAddress) {
			setValue("address", suggestedAddress.street);
			setValue("apartment", suggestedAddress.streetTwo);
			setValue("city", suggestedAddress.city);
			setValue("state", suggestedAddress.state);
			setValue("zipCode", suggestedAddress.zipCode);
			setSuggestedAddress(null);
			setIsValid(true);
			setOpenDialog(false);
			setIsDeliveryFormFilled(true);
		}
	};

	// Watch form fields to determine if the form is filled out
	const watchFields = watch([
		"firstName",
		"lastName",
		"address",
		"city",
		"state",
		"zipCode",
	]);

	const prevFieldsRef = useRef<FormFields>({
		firstName: "",
		lastName: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
	});

	useEffect(() => {
		const isFormFilled = watchFields.every(
			(field) => field && field.trim() !== ""
		);

		const currentFields = {
			firstName: watch("firstName"),
			lastName: watch("lastName"),
			address: watch("address"),
			apartment: watch("apartment"),
			city: watch("city"),
			state: watch("state"),
			zipCode: watch("zipCode"),
		};

		const hasChanged = Object.keys(currentFields).some(
			(key) =>
				currentFields[key as keyof FormFields] !==
				prevFieldsRef.current[key as keyof FormFields]
		);

		if (isFormFilled && hasChanged) {
			validateAddress(currentFields);
		}

		setIsDeliveryFormFilled(isFormFilled && isValid);

		// Update global state whenever the form fields change
		if (isFormFilled && isValid && hasChanged) {
			dispatch({
				type: "SET_SHIPPING_INFO",
				payload: {
					...state.cart.shippingInformation,
					firstNameShipping: currentFields.firstName,
					lastNameShipping: currentFields.lastName,
					company: watch("company"),
					address: {
						street: currentFields.address,
						streetTwo: watch("apartment"),
						city: currentFields.city,
						state: currentFields.state,
						zipCode: currentFields.zipCode,
					},
					shippingContactEmail:
						state.cart.shippingInformation.shippingContactEmail,
				},
			});
		}

		prevFieldsRef.current = currentFields;
	}, [watchFields, isValid]);

	return (
		<form className="flex flex-col items-center justify-center">
			<h1 className="text-2xl font-bold self-start mb-3">Delivery</h1>
			{/* Country */}
			<FormControl
				fullWidth
				margin="dense"
				error={!!errors.country}
				className="m-0"
			>
				<InputLabel>Country/Region</InputLabel>
				<Controller
					name="country"
					control={control}
					defaultValue="United States"
					rules={{ required: "Country is required" }}
					render={({ field }) => (
						<Select {...field} label="Country/Region">
							<MenuItem value="United States">United States</MenuItem>
						</Select>
					)}
				/>
				{errors.country && (
					<FormHelperText>{String(errors.country.message)}</FormHelperText>
				)}
			</FormControl>
			{/* First name, last name, company */}
			<div className="flex flex-row w-full gap-4">
				<FormControl
					fullWidth
					margin="dense"
					error={!!errors.firstName}
					className="m-0"
				>
					<Controller
						name="firstName"
						control={control}
						defaultValue=""
						rules={{ required: "First name is required" }}
						render={({ field }) => (
							<TextField
								{...field}
								label="First name"
								fullWidth
								margin="dense"
								error={!!errors.firstName}
							/>
						)}
					/>
					{errors.firstName && (
						<FormHelperText>{String(errors.firstName.message)}</FormHelperText>
					)}
				</FormControl>

				<FormControl fullWidth margin="dense" error={!!errors.lastName}>
					<Controller
						name="lastName"
						control={control}
						defaultValue=""
						rules={{ required: "Last name is required" }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Last name"
								fullWidth
								margin="dense"
								error={!!errors.lastName}
							/>
						)}
					/>
					{errors.lastName && (
						<FormHelperText>{String(errors.lastName.message)}</FormHelperText>
					)}
				</FormControl>
			</div>
			{/* Company */}
			<FormControl fullWidth margin="dense">
				<Controller
					name="company"
					control={control}
					defaultValue=""
					render={({ field }) => (
						<TextField
							{...field}
							label="Company (optional)"
							fullWidth
							margin="dense"
						/>
					)}
				/>
			</FormControl>
			{/* Address */}
			<FormControl fullWidth margin="dense" error={!!errors.address}>
				<Controller
					name="address"
					control={control}
					defaultValue=""
					rules={{ required: "Address is required" }}
					render={({ field }) => (
						<TextField
							{...field}
							label="Address"
							fullWidth
							margin="dense"
							error={!!errors.address}
						/>
					)}
				/>
				{errors.address && (
					<FormHelperText>{String(errors.address.message)}</FormHelperText>
				)}
			</FormControl>
			{/* Apartment, suite, etc. */}
			<FormControl fullWidth margin="dense">
				<Controller
					name="apartment"
					control={control}
					defaultValue=""
					render={({ field }) => (
						<TextField
							{...field}
							label="Apartment, suite, etc. (optional)"
							fullWidth
							margin="dense"
						/>
					)}
				/>
			</FormControl>
			{/* ZIP code, city, state */}
			<div className="flex flex-row w-full gap-2 items-center">
				<FormControl fullWidth margin="dense" error={!!errors.zipCode}>
					<Controller
						name="zipCode"
						control={control}
						defaultValue=""
						rules={{ required: "Postal code is required" }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Postal code"
								fullWidth
								margin="dense"
								error={!!errors.zipCode}
								onChange={(e) => {
									field.onChange(e);
									const value = e.target.value;
									if (value.length === 5) {
										setPostalCode(value);
									}
								}}
							/>
						)}
					/>
					{errors.zipCode && (
						<FormHelperText>{String(errors.zipCode.message)}</FormHelperText>
					)}
				</FormControl>

				<FormControl fullWidth margin="dense" error={!!errors.city}>
					<Controller
						name="city"
						control={control}
						defaultValue=""
						rules={{ required: "City is required" }}
						render={({ field }) => (
							<TextField
								{...field}
								label="City"
								fullWidth
								margin="dense"
								error={!!errors.city}
							/>
						)}
					/>
					{errors.city && (
						<FormHelperText>{String(errors.city.message)}</FormHelperText>
					)}
				</FormControl>

				<FormControl fullWidth margin="dense" error={!!errors.state}>
					<InputLabel style={{ fontSize: "0.9rem", marginTop: ".4rem" }}>
						State
					</InputLabel>
					<Controller
						name="state"
						control={control}
						defaultValue=""
						rules={{ required: "State is required" }}
						render={({ field }) => (
							<Select
								{...field}
								label="State"
								style={{
									fontSize: ".9rem",
									paddingBottom: ".1rem",
									marginTop: ".4rem",
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
								{states.map((state, i) => (
									<MenuItem
										key={i}
										value={state.abbreviation}
										style={{ fontSize: "0.9rem" }}
									>
										{state.name}
									</MenuItem>
								))}
							</Select>
						)}
					/>
					{errors.state && (
						<FormHelperText>{String(errors.state.message)}</FormHelperText>
					)}
				</FormControl>
			</div>
			{/* Phone */}
			<FormControl fullWidth margin="dense" error={!!errors.phone}>
				<Controller
					name="phone"
					control={control}
					defaultValue=""
					rules={{
						pattern: {
							value: /^[0-9]{10}$/,
							message: "Phone number must be 10 digits",
						},
					}}
					render={({ field }) => (
						<MaskedInput
							mask={[
								"(",
								/[1-9]/,
								/\d/,
								/\d/,
								")",
								" ",
								/\d/,
								/\d/,
								/\d/,
								"-",
								/\d/,
								/\d/,
								/\d/,
								/\d/,
							]}
							{...field}
							render={(ref: any, props: any) => (
								<TextField
									{...props}
									inputRef={ref}
									label="Phone"
									fullWidth
									margin="dense"
									error={!!errors.phone}
								/>
							)}
						/>
					)}
				/>
				{errors.phone && (
					<FormHelperText>{String(errors.phone.message)}</FormHelperText>
				)}
			</FormControl>

			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>Address Suggestion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						We found a suggested address. Would you like to use it?
					</DialogContentText>
					{suggestedAddress && (
						<p>{`${suggestedAddress.street}, ${suggestedAddress.city}, ${suggestedAddress.state} ${suggestedAddress.zipCode}`}</p>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Keep Original</Button>
					<Button onClick={handleUseSuggestedAddress} autoFocus>
						Use Suggested
					</Button>
				</DialogActions>
			</Dialog>
		</form>
	);
};

export default DeliveryAddressForm;
