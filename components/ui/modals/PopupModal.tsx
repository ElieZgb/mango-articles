"use client";
import { useUsernamePopupState } from "@state/usernamePopup";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { checkUsernameAvailability } from "@app/lib/checkUsernameAvailability";

export default function PopupModal() {
	const [loading, setLoading] = useState<boolean>(false);
	const [username, setUsername] = useState<string>("");
	const [success, setSuccess] = useState<boolean | null>(null);
	const [hidden, setHidden] = useState(true);
	const { data: popupState, setData: setPopupState } =
		useUsernamePopupState();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	useEffect(() => {
		if (popupState?.isOpen) {
			setHidden(false);
			if (document) {
				document.body.style.overflow = "hidden";
			}
		} else {
			if (document) {
				document.body.style.overflow = "unset";
			}
		}
	}, [popupState]);

	const closePopup = () => {
		setPopupState({ ...popupState, isOpen: false });
		setTimeout(() => {
			setHidden(true);
		}, 500);
	};

	useEffect(() => {
		setLoading(false);
		setSuccess(null);
		if (!username.trim()) return;

		const timeout = setTimeout(() => {
			setLoading(true);
			checkUsernameAvailability(username).then((isAvailable) => {
				setSuccess(isAvailable);
				setLoading(false);
			});
		}, 800);

		return () => clearTimeout(timeout);
	}, [username]);

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setIsSubmitting(true);

		const email = popupState?.email;

		if (!success || !email) {
			setIsSubmitting(false);
			setPopupState({ isOpen: false });
			return;
		}

		const userUpdateResponse = await fetch("/api/users", {
			method: "PATCH",
			body: JSON.stringify({
				email: email,
				data: { username },
			}),
		});

		const updatedUser = await userUpdateResponse.json();
		console.log({ updatedUser });
		setPopupState({ isOpen: false, email: null });
		setIsSubmitting(false);
	};

	if (hidden) {
		return null;
	}

	return (
		<div
			className={clsx([
				"absolute h-full w-full flex items-center justify-center bg-[#ffffff7b] z-10",
				popupState?.isOpen && "modal_fade_in z-50",
				!popupState?.isOpen && "modal_fade_out -z-50",
			])}
		>
			<div className="absolute w-full h-full" onClick={closePopup} />
			<div className="relative min-w-[400px] max-[450px]:min-w-[unset] max-[500px]:w-[90%] w-[50%] max-w-[500px] flex flex-col justify-center gap-5 px-8 py-8 items-center bg-white rounded-sm modal_box_shadow border-[2px] border-mango">
				<h3 className="text-4xl max-[500px]:text-2xl font-logo">
					Create username
				</h3>
				<p className="text-center text-sm max-[360px]:text-xs">
					Pick a username for your new account.
					<br />
					Make it stand out! You can&apos;t change it later.
				</p>
				<form onSubmit={handleSubmit} className="w-full max-w-[300px]">
					<div className="relative">
						<input
							value={username}
							className="block bg-mango pt-2 pb-1 px-3 outline-none w-full rounded-sm"
							type="text"
							placeholder="Username"
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Loader2
							size={20}
							className={`absolute top-[50%] translate-y-[-50%] right-2 animate-spin invisible ${
								loading && "visible"
							}`}
							color="#191919"
						/>
					</div>
					{success == false && (
						<div className="text-red-500 text-xs mt-1">
							This username is taken!
						</div>
					)}
					{success == true && (
						<div className="text-green-700 text-xs mt-1">
							This username is available!
						</div>
					)}
					<div className="relative flex items-center justify-center">
						<input
							className={clsx(
								"block pt-2 pb-1 mt-2 text-center bg-white border-[1.5px] border-black w-full rounded-sm cursor-pointer",
								isSubmitting ? "text-transparent" : "text-black"
							)}
							type="submit"
							value="Next"
						/>
						{isSubmitting && (
							<Loader2
								size={20}
								className="absolute top-[38%] animate-spin"
							/>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
