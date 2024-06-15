import React, { useState } from "react";
import { useRouter } from "next/router";
import {
	TextField,
	Button,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";
import client from "../../../sanity/lib/client";

const Search: React.FC = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<any[]>([]);
	const router = useRouter();

	const handleSearch = async () => {
		if (query.trim() === "") return;

		// Fetch search results from your backend or API
		const data = await client.fetch(
			`*[_type == "product" && name match "${query}*"]`
		);
		setResults(data);
	};

	const handleResultClick = (slug: string) => {
		router.push(`/product/${slug}`);
	};

	return (
		<div>
			<TextField
				label="Search"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				variant="outlined"
				fullWidth
			/>
			<Button onClick={handleSearch} variant="contained" color="primary">
				Search
			</Button>
			{results.length > 0 ? (
				<List>
					{results.map((result) => (
						<ListItem
							component="button"
							key={result._id}
							onClick={() => handleResultClick(result.slug.current)}
						>
							<ListItemText primary={result.name} />
						</ListItem>
					))}
				</List>
			) : (
				<Typography variant="body1" color="textSecondary">
					No results found. Here are some suggestions:
				</Typography>
			)}
		</div>
	);
};

export default Search;
