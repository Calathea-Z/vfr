import { State, Action } from "./stateStorage";

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
        case "CART_ADD_ITEM":
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find(item => item._key === newItem._key);
            const cartItemsAfterAdd = existItem
                ? state.cart.cartItems.map(item => item._key === existItem._key ? { ...item, quantity: item.quantity + newItem.quantity } : item)
                : [...state.cart.cartItems, newItem];
            localStorage.setItem('cartItems', JSON.stringify(cartItemsAfterAdd));
            return { ...state, cart: { ...state.cart, cartItems: cartItemsAfterAdd } };

        case "CART_REMOVE_ITEM":
            const cartItemsAfterRemove = state.cart.cartItems.filter(item => item._key !== action.payload._key);
            localStorage.setItem('cartItems', JSON.stringify(cartItemsAfterRemove));
            return { ...state, cart: { ...state.cart, cartItems: cartItemsAfterRemove } };

        case "CART_CLEAR_ITEMS":
            localStorage.removeItem('cartItems');
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
