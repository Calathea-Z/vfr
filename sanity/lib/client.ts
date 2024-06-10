import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "../env";

const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn,
	perspective: "published",
});

export default client;
