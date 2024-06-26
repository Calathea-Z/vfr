import client from "../../../sanity/lib/client";
//---Framework---//
import React, { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation"; // Change import to next/navigation
//---Packages---//
import { Autocomplete, TextField, IconButton } from "@mui/material";
import { XCircle } from "@phosphor-icons/react";

const Search: FC<{ visible: boolean; onClose: () => void }> = ({
	visible,
	onClose,
}) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<any[]>([]);
	const router = useRouter(); // Use useRouter from next/navigation

	useEffect(() => {
		const handleSearch = async () => {
			if (query.trim().length < 3) return;

			// Fetch search results from your backend or API
			const data = await client.fetch(
				`*[_type == "product" && name match "${query}*"]`
			);
			setResults(data);
		};

		handleSearch();
	}, [query]);

	const handleResultClick = (slug: string) => {
		router.push(`/shop/product/${slug}`);
		onClose();
	};
	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" && query.trim().length >= 3) {
			router.push(`/shop/product/search/${query}`);
		}
	};

	if (!visible) return null;

	return (
		<div className="flex items-center justify-center w-full p-6">
			<div className="flex items-center w-full md:w-2/3 relative">
				<IconButton
					onClick={onClose}
					sx={{
						position: "absolute",
						left: "-.5rem",
						top: "4%",
						transform: "translateY(-50%)",
						zIndex: 10,
						backgroundColor: "white",
						padding: 0,
						"&:hover": {
							backgroundColor: "rgb(255, 204, 204)",
							opacity: 1,
						},
					}}
				>
					<XCircle size={20} />
				</IconButton>
				<Autocomplete
					freeSolo
					options={results.map((result) => result.name)}
					onInputChange={(event, newInputValue) => {
						setQuery(newInputValue);
					}}
					onChange={(event, newValue) => {
						const selectedResult = results.find(
							(result) => result.name === newValue
						);
						if (selectedResult) {
							handleResultClick(selectedResult.slug.current);
						}
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="outlined"
							placeholder="Search..."
							autoFocus
							fullWidth
							onKeyPress={handleKeyPress} // Add this line to handle "Enter" key press
							sx={{
								"& .MuiOutlinedInput-root": {
									"& .MuiOutlinedInput-notchedOutline": {
										borderColor: "rgb(5, 150, 105) !important",
									},
								},
							}}
							InputProps={{
								...params.InputProps,
								style: {
									color: "rgb(5, 150, 105)",
									fontSize: "1rem",
									fontWeight: "bold",
									fontStyle: "italic",
								},
							}}
							InputLabelProps={{
								style: {
									color: "#043391",
									fontSize: "1rem",
									fontWeight: "bold",
									fontStyle: "italic",
								},
							}}
						/>
					)}
					PaperComponent={({ children }) => (
						<div
							className="absolute bg-white shadow-md mt-1 rounded-lg"
							style={{
								width: "100%",
								top: "100%",
								maxHeight: "300px",
								overflowY: "auto",
								zIndex: 1,
							}}
						>
							{children}
						</div>
					)}
					sx={{ width: "100%" }} // Ensure the Autocomplete takes full width of its container
				/>
			</div>
		</div>
	);
};
export default Search;
