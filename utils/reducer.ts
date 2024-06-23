import { State, Action, CartItem } from "./stateStorage";

const saveCartToLocalStorage = (cartItems: CartItem[]) => {
	localStorage.setItem("cartItems", JSON.stringify(cartItems));
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
			console.log("Reducer - Updated cart items:", cartItems);
			saveCartToLocalStorage(cartItems);
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case "CART_REMOVE_ITEM": {
			const cartItems = state.cart.cartItems.filter(
				(x) => x.productId !== action.payload.productId
			);
			saveCartToLocalStorage(cartItems);
			return { ...state, cart: { ...state.cart, cartItems } };
		}

		case "CART_CLEAR_ITEMS":
			localStorage.removeItem("cartItems");
			return { ...state, cart: { ...state.cart, cartItems: [] } };

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

		case "UPDATE_SHIPPING_WEIGHT":
			return {
				...state,
				cart: { ...state.cart, shippingWeight: action.payload },
			};

		default:
			return state;
	}
};
