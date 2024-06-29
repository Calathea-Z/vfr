"use client";

//---Framework---//
import React from "react";
import { useForm, Controller } from "react-hook-form";
//---Packages---//
import {
	TextField,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	FormHelperText,
} from "@mui/material";
import states from "states-us";
import MaskedInput from "react-text-mask";

const DeliveryAddressForm = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data: any) => {
		console.log(data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col items-center justify-center"
		>
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
					<InputLabel style={{ fontSize: "0.9rem" }}>State</InputLabel>
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
									fontSize: "0.9rem",
									paddingBottom: ".1rem",
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
										value={state.name}
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
					// Render function for the phone number input field
					render={({ field }) => (
						<MaskedInput
							// Mask pattern for the phone number input
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
		</form>
	);
};

export default DeliveryAddressForm;
