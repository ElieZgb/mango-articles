"use client";
import React from "react";
import {
	QueryClient,
	QueryClientProvider,
} from "@node_modules/@tanstack/react-query";

const queryClient = new QueryClient();

export default function TanstackProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
