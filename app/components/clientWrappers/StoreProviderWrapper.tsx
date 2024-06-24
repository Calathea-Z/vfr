"use client";

import { StoreProvider } from "@/utils/stateStorage";

const StoreProviderWrapper = ({ children }: { children: React.ReactNode }) => {
	return <StoreProvider>{children}</StoreProvider>;
};

export default StoreProviderWrapper;
