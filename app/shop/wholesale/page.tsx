"use client";
//---Framework---//
import { useState } from "react";
//---Packages---///
import {
	Button,
	TextField,
	Container,
	Box,
	Typography,
	CssBaseline,
	Grid,
	useTheme,
	useMediaQuery,
} from "@mui/material";

const Wholesale = () => {
	const [showForm, setShowForm] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		alert("Form submitted!"); // Placeholder action
	};

	return (
		<Container
			component="main"
			maxWidth="xs"
			className="bg-primary min-h-screen"
		>
			<CssBaseline />
			<Box
				className="bg-primary mt-8 flex flex-col items-center" // Using Tailwind CSS for styling
				style={{ minHeight: "100vh" }} // Ensure at least the height of the viewport
			>
				<Typography component="h1" variant={isMobile ? "h6" : "h5"}>
					Wholesale Program
				</Typography>
				{showForm ? (
					<Box
						component="form"
						onSubmit={handleFormSubmit}
						noValidate
						className="mt-1 bg-primary" // Using Tailwind CSS for styling
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="businessName"
							label="Business Name"
							name="businessName"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="address"
							label="Address"
							name="address"
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							id="contactInfo"
							label="Contact Info"
							name="contactInfo"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Submit
						</Button>
					</Box>
				) : (
					<Button
						onClick={() => setShowForm(true)}
						fullWidth
						variant="outlined"
						className="mt-3 mb-2 bg-primary" // Using Tailwind CSS for styling
					>
						Join our Wholesale Program
					</Button>
				)}
			</Box>
		</Container>
	);
};
export default Wholesale;
