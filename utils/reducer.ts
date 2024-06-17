import {
	State,
	Action,
	CartItem,
	UserInfo,
	ShippingInformation,
} from "./stateStorage";
import Cookies from "universal-cookie";

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "CART_ADD_ITEM": {
			const newItem = action.payload;
			const existItem = state.cart.cartItems.find(
				(item) => item._key === newItem._key
			);
			const cartItems = existItem
				? state.cart.cartItems.map((item) =>
						item._key === existItem._key ? newItem : item
					)
				: [...state.cart.cartItems, newItem];
			const cookies = new Cookies();
			cookies.set("cartItems", JSON.stringify(cartItems));
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case "CART_REMOVE_ITEM": {
			const cartItems = state.cart.cartItems.filter(
				(item) => item._key !== action.payload._key
			);
			const cookies = new Cookies();
			cookies.set("cartItems", JSON.stringify(cartItems));
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case "CART_CLEAR_ITEMS": {
			return { ...state, cart: { ...state.cart, cartItems: [] } };
		}
		case "USER_LOGIN": {
			return { ...state, userInfo: action.payload };
		}
		case "USER_LOGOUT": {
			return {
				...state,
				userInfo: null,
				cart: {
					cartItems: [],
					shippingInformation: {
						address: "",
						city: "",
						postalCode: "",
						country: "",
					},
					shippingWeight: null,
					shippingCost: null,
					orderSuccess: false,
				},
			};
		}
		case "SAVE_SHIPPING_ADDRESS": {
			return {
				...state,
				cart: {
					...state.cart,
					shippingInformation: {
						...state.cart.shippingInformation,
						...action.payload,
					},
				},
			};
		}
		case "UPDATE_SHIPPING_WEIGHT": {
			return {
				...state,
				cart: { ...state.cart, shippingWeight: action.payload },
			};
		}
		case "UPDATE_SHIPPING_COST": {
			return {
				...state,
				cart: { ...state.cart, shippingCost: action.payload },
			};
		}
		case "UPDATE_PAYMENT_SUCCESS": {
			return {
				...state,
				cart: { ...state.cart, orderSuccess: action.payload },
			};
		}
		case "CLEAR_PAYMENT_STATUS": {
			return {
				...state,
				cart: { ...state.cart, orderSuccess: false },
			};
		}
		case "SHOW_CART": {
			return { ...state, isCartVisible: true };
		}
		case "HIDE_CART": {
			return { ...state, isCartVisible: false };
		}
		case "INITIALIZE_STATE": {
			const { cartItems, userInfo } = action.payload;
			return {
				...state,
				cart: { ...state.cart, cartItems },
				userInfo,
			};
		}
		default:
			return state;
	}
};
