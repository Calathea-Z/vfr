import client from "../sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

function sanityImageBuilder(source) {
	return builder.image(source);
}
export { sanityImageBuilder };
