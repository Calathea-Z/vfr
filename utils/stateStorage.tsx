import {
	createContext,
	useReducer,
	useEffect,
	ReactNode,
	Dispatch,
} from "react";
import Cookies from "universal-cookie";

interface CartItem {
	_key: string;
	// Add other properties of CartItem as needed
}

interface ShippingInformation {
	// Define properties for shipping information
}

interface State {
	cart: {
		cartItems: CartItem[];
		shippingInformation: ShippingInformation;
		shippingWeight: number | null;
		shippingCost: number | null;
		orderSuccess: boolean;
	};
	userInfo: any; // Define a more specific type if possible
	isCartVisible: boolean;
}

interface Action {
	type: string;
	payload?: any; // Define a more specific type or use multiple action types if possible
}

const defaultInitialState: State = {
	cart: {
		cartItems: [],
		shippingInformation: {},
		shippingWeight: null,
		shippingCost: null,
		orderSuccess: false,
	},
	userInfo: null,
	isCartVisible: false,
};

// Corrected: Moved the declaration of defaultInitialState above its usage
export const stateStorage = createContext<{
	state: State;
	dispatch: Dispatch<Action>;
} | null>({
	state: defaultInitialState,
	dispatch: () => null,
});

const Store = createContext<{ state: State; dispatch: Dispatch<Action> }>({
	state: defaultInitialState,
	dispatch: () => null,
});

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "CART_ADD_ITEM": {
			const newItem = action.payload as CartItem;
			const existItem = state.cart.cartItems.find(
				(item) => item._key === newItem._key
			);
			// Update cart items, replacing existing item if found, otherwise adding new item
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
			// Filter out the item to be removed from the cart
			const cartItems = state.cart.cartItems.filter(
				(item) => item._key !== action.payload._key
			);
			const cookies = new Cookies();
			cookies.set("cartItems", JSON.stringify(cartItems)); // Update cookies with new cart items
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		case "CART_CLEAR_ITEMS": {
			// Clear all items from the cart
			return { ...state, cart: { ...state.cart, cartItems: [] } };
		}
		case "USER_LOGIN": {
			// Set user info upon login
			return { ...state, userInfo: action.payload };
		}
		case "USER_LOGOUT": {
			// Clear user info and reset cart upon logout
			return {
				...state,
				userInfo: null,
				cart: {
					cartItems: [],
					shippingInformation: {},
					shippingWeight: null,
					shippingCost: null,
					orderSuccess: false,
				},
			};
		}
		case "SAVE_SHIPPING_ADDRESS": {
			// Save or update shipping address in the cart
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
			// Update the shipping weight for the cart
			return {
				...state,
				cart: { ...state.cart, shippingWeight: action.payload },
			};
		}
		case "UPDATE_SHIPPING_COST": {
			// Update the shipping cost for the cart
			return {
				...state,
				cart: { ...state.cart, shippingCost: action.payload },
			};
		}
		case "UPDATE_PAYMENT_SUCCESS": {
			// Update payment success status
			return {
				...state,
				cart: { ...state.cart, orderSuccess: action.payload },
			};
		}
		case "CLEAR_PAYMENT_STATUS": {
			// Clear payment success status
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
			// Initialize state with values from cookies
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
}
interface StoreProviderProps {
	children: ReactNode;
	initialCookies: {
		cartItems?: string;
		userInfo?: string;
	};
}

export function StoreProvider({
	children,
	initialCookies,
}: StoreProviderProps) {
	const [state, dispatch] = useReducer(reducer, defaultInitialState);

	useEffect(() => {
		if (initialCookies) {
			const cartItems = initialCookies.cartItems
				? JSON.parse(initialCookies.cartItems)
				: [];
			const userInfo = initialCookies.userInfo
				? JSON.parse(initialCookies.userInfo)
				: null;
			dispatch({ type: "INITIALIZE_STATE", payload: { cartItems, userInfo } });
		}
	}, [initialCookies]);

	const value = { state, dispatch };

	return <Store.Provider value={value}>{children}</Store.Provider>;
}
