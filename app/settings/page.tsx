"use client";
import DangerZone from "@components/ui/DangerZone";
import { useSession } from "@node_modules/next-auth/react";
import { redirect } from "@node_modules/next/navigation";
import React from "react";

export default function Page() {
	const { status } = useSession();

	if (status == "unauthenticated") {
		return redirect("/");
	}

	return (
		<div className="flex justify-center py-12">
			<div className="mx-16 max-[500px]:mx-7 max-w-[800px] w-full min-h-[73vh]">
				{/* Danger Zone */}
				<DangerZone />
			</div>
		</div>
	);
}
