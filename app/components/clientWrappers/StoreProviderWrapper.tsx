"use client";

import { FC, ReactNode } from "react";
import { StoreProvider } from "@/utils/stateStorage";

interface StoreProviderWrapperProps {
	children: ReactNode;
}

const StoreProviderWrapper: FC<StoreProviderWrapperProps> = ({ children }) => {
	return <StoreProvider>{children}</StoreProvider>;
};

export default StoreProviderWrapper;
