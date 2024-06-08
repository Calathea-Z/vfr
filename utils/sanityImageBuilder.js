import { sanityClient } from "../sanity/lib/sanityClient";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(sanityClient);

function sanityImageBuilder(source) {
	return builder.image(source);
}
export { sanityImageBuilder };
