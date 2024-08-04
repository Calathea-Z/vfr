import { State, Action } from "./stateStorage";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const updateCartInCookies = (cartItems: any[]) => {
	cookies.set("cartItems", JSON.stringify(cartItems), { path: "/" });
};

const updateShippingWeightInCookies = (shippingWeight: number) => {
	cookies.set("shippingWeight", JSON.stringify(shippingWeight), {
		path: "/",
	});
};

const updateShippingCostInCookies = (shippingCost: number) => {
	cookies.set("shippingCost", JSON.stringify(shippingCost), { path: "/" });
};

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "CART_ADD_ITEM": {
			const item = action.payload;
			const existItem = state.cart.cartItems.find(
				(x) => x.productId === item.productId
			);
			const cartItems = existItem
				? state.cart.cartItems.map((x) =>
						x.productId === existItem.productId ? item : x
					)
				: [...state.cart.cartItems, item];
			updateCartInCookies(cartItems);
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case "CART_REMOVE_ITEM": {
			const cartItems = state.cart.cartItems.filter(
				(x) => x.productId !== action.payload.productId
			);
			updateCartInCookies(cartItems);
			return { ...state, cart: { ...state.cart, cartItems } };
		}

		case "CART_CLEAR_ITEMS":
			updateCartInCookies([]);
			return { ...state, cart: { ...state.cart, cartItems: [] } };

		case "SET_CART_ITEMS": {
			const cartItems = action.payload;
			updateCartInCookies(cartItems);
			return { ...state, cart: { ...state.cart, cartItems } };
		}

		case "SHOW_CART":
			return { ...state, isCartVisible: true };

		case "HIDE_CART":
			return { ...state, isCartVisible: false };

		case "SHOW_TOP_BANNER":
			return { ...state, isTopBannerVisible: true };

		case "HIDE_TOP_BANNER":
			return { ...state, isTopBannerVisible: false };

		case "INITIALIZE_STATE":
			return {
				...state,
				cart: { ...state.cart, cartItems: action.payload.cartItems },
				userInfo: action.payload.userInfo,
			};

		case "SET_SHIPPING_INFO":
			return {
				...state,
				cart: {
					...state.cart,
					shippingInformation: action.payload,
				},
			};

		case "UPDATE_SHIPPING_WEIGHT":
			updateShippingWeightInCookies(action.payload);
			return {
				...state,
				cart: { ...state.cart, shippingWeight: action.payload },
			};

		case "UPDATE_SHIPPING_COST":
			updateShippingCostInCookies(action.payload);
			return {
				...state,
				cart: { ...state.cart, shippingCost: action.payload },
			};

		case "UPDATE_PAYMENT_SUCCESS":
			return {
				...state,
				cart: { ...state.cart, orderSuccess: action.payload },
			};

		case "CLEAR_PAYMENT_STATUS":
			return {
				...state,
				cart: { ...state.cart, orderSuccess: false },
			};

		case "USER_LOGIN":
			return { ...state, userInfo: action.payload };

		case "USER_LOGOUT":
			return { ...state, userInfo: null };

		default:
			return state;
	}
};
