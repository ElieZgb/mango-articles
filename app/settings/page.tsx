import DangerZone from "@components/ui/DangerZone";
import React from "react";

export default function page() {
	return (
		<div className="flex justify-center py-12">
			<div className="mx-16 max-w-[800px] w-full min-h-[73vh]">
				{/* Danger Zone */}
				<DangerZone />
			</div>
		</div>
	);
}
