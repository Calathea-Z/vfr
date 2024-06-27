const { createClient } = require("@sanity/client");

// Initialize the Sanity client
const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Replace with your project ID
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Replace with your dataset name
	token: process.env.SANITY_AUTH_TOKEN, // Replace with your token if you have one
	useCdn: false, // `false` if you want to ensure fresh data
});

async function updateTaglines() {
	try {
		// Fetch all products
		const products = await client.fetch(`*[_type == "product"]{_id}`);

		// Update each product's tagline
		const updates = products.map((product) =>
			client
				.patch(product._id)
				.set({ tagLine: "This is a tag line! Bag It! Tag It!" })
				.commit()
		);

		// Wait for all updates to complete
		await Promise.all(updates);

		console.log("All taglines updated successfully!");
	} catch (error) {
		console.error("Error updating taglines:", error);
	}
}

updateTaglines();
