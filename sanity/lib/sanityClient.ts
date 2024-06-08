import { createClient } from "next-sanity";

export const sanityClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.SANITY_TOKEN,
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
	useCdn: true,
	perspective: "published",
});
