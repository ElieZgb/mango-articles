"use client";
import { useEffect } from "react";
import { redirect } from "@node_modules/next/navigation";
import { usePopupState } from "@state/popups";

export default function Page() {
	const { setData } = usePopupState();

	useEffect(() => {
		setData({ isOpen: true });
	}, [setData]);

	return redirect("/");
}
