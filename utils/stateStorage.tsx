import {
	createContext,
	useReducer,
	useEffect,
	ReactNode,
	Dispatch,
} from "react";
import Cookies from "universal-cookie";

// Corrected: Provide a default value for createContext
export const stateStorage = createContext(null);

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
			const cartItems = existItem
				? state.cart.cartItems.map((item) =>
						item._key === existItem._key ? newItem : item
					)
				: [...state.cart.cartItems, newItem];
			const cookies = new Cookies();
			cookies.set("cartItems", JSON.stringify(cartItems));
			return { ...state, cart: { ...state.cart, cartItems } };
		}
		// Add other cases here
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
