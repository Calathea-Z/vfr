import product from "./product";
//Remove wholeSaleProduct, but leaving in in case client wants it back later.
// import wholeSaleProduct from "./wholeSaleProduct";
import stockist from "./stockist";
import bio from "./bio";
import category from "./category";
import subCategory from "./subCategory";
import topBanner from "./topBanner";
import sideButton from "./sideButton";

export const schemaTypes: any[] = [
	product,
	// wholeSaleProduct,
	stockist,
	bio,
	category,
	subCategory,
	topBanner,
	sideButton,
];
