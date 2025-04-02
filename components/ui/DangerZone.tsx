"use client";
import React, { useState } from "react";
import { useRouter } from "@node_modules/next/navigation";
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "@node_modules/next-auth/react";

export default function DangerZone() {
	const router = useRouter();
	const [deletingAccount, setDeletingAccount] = useState(false);
	const [deleteAccountModal, setDeleteAccountModal] = useState(false);
	const { data: sessionData } = useSession();

	const handleDeleteAccount = async () => {
		setDeletingAccount(true);

		if (sessionData) {
			try {
				const res = await fetch(
					`/api/users?email=${sessionData?.user.email}`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				const data = await res.json();
				console.log(data);
				signOut({ callbackUrl: "/" });
			} catch (e) {
				console.log("Error deleting user", e);
			} finally {
				setDeletingAccount(false);
			}
		}
	};

	return (
		<div className="mb-10 border border-red-800 rounded-sm relative">
			{deleteAccountModal && (
				<div className="absolute w-full h-full left-0 top-0 rounded-sm flex flex-col items-center justify-center bg-background">
					<h3 className="text-xl font-display-medium">
						Are you sure you want to delete your account?
					</h3>
					<div className="flex gap-3 mt-5">
						<button
							onClick={() => setDeleteAccountModal(false)}
							className="cursor-pointer px-5 py-1 rounded-lg font-display-medium bg-green-300 text-green-800"
						>
							Cancel
						</button>
						<button
							onClick={handleDeleteAccount}
							className={`cursor-pointer relative px-5 py-1 rounded-lg font-display-medium bg-red-300 ${
								deletingAccount
									? "text-transparent"
									: "text-red-800"
							}`}
						>
							Delete account
							{deletingAccount && (
								<Loader2
									size={20}
									className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] text-red-800 animate-spin"
								/>
							)}
						</button>
					</div>
				</div>
			)}
			<div className="px-5 py-3 border-b border-red-800">
				<h3 className="text-xl text-red-700 font-display-bold -mb-1">
					Danger Zone
				</h3>
				<span className="text-base font-display-light text-[#777]">
					Delete user account
				</span>
			</div>
			<div className="px-5 py-5 text-black">
				<p>
					By deleting your account you will lose all your data and
					access to any article that you are associated with.
				</p>
				<button
					onClick={() => setDeleteAccountModal(true)}
					className="mt-3 cursor-pointer px-5 py-1 rounded-lg font-display-medium bg-red-300 border-2 border-red-700 text-red-800"
				>
					Delete my account
				</button>
			</div>
		</div>
	);
}
