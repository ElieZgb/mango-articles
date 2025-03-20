"use client";
import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
import clsx from "clsx";
import CloseButton from "../buttons/CloseButton";

import FacebookIcon from "@public/assets/icons/facebook-icon.svg";
import GoogleIcon from "@public/assets/icons/google-icon.svg";
import XIcon from "@public/assets/icons/x-icon.svg";
import EmailIcon from "@public/assets/icons/email-icon.svg";
import AppleIcon from "@public/assets/icons/apple-icon.svg";

import Image from "@node_modules/next/image";
import type { StaticImport } from "@node_modules/next/dist/shared/lib/get-img-props";
import { signIn } from "@node_modules/next-auth/react";
// import { zodResolver } from "@node_modules/@hookform/resolvers/zod/dist";
// import { signInSchema } from "@schema/signInSchema";

export default function AuthenticationModal() {
	const [active, setActive] = useState(true);
	const [hidden, setHidden] = useState(false);
	const [isLoginForm, setIsLoginForm] = useState(true);
	// const {} = useForm({
	// 	resolver: zodResolver(signInSchema),
	// });

	useEffect(() => {}, []);

	const closeModal = () => {
		setActive(false);
		setTimeout(() => {
			setHidden(true);
		}, 500);
	};

	if (hidden) {
		return null;
	}

	return (
		<div
			className={clsx([
				"absolute w-[100vw] h-[100vh] bg-[#ffffffea] top-0 left-0 flex justify-center items-center",
				active && "modal_fade_in z-50",
				!active && "modal_fade_out -z-50",
			])}
		>
			<div
				className="absolute top-0 left-0 w-full h-full"
				onClick={closeModal}
			/>
			<div
				className={clsx([
					"relative w-[70%] max-w-[678px] bg-white modal_box_shadow",
					active && "modal_content_fade_in",
					!active && "modal_content_fade_out",
				])}
			>
				<CloseButton
					closeModal={closeModal}
					className="cursor-pointer absolute top-4 right-4"
				/>
				{isLoginForm ? (
					<LoginUI setIsLoginForm={setIsLoginForm} />
				) : (
					<RegisterUI setIsLoginForm={setIsLoginForm} />
				)}
			</div>
		</div>
	);
}

const LoginUI = ({
	setIsLoginForm,
}: {
	setIsLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<div className="flex flex-col items-center w-[80%] mx-auto">
			<h1 className="font-logo text-3xl mt-14 mb-16">Welcome Back.</h1>
			<AuthProviderButton
				onClick={() => {
					signIn("google");
				}}
				label="Sign in with Google"
				icon={GoogleIcon}
			/>
			<AuthProviderButton
				onClick={() => {}}
				label="Sign in with Facebook"
				icon={FacebookIcon}
			/>
			<AuthProviderButton
				onClick={() => {}}
				label="Sign in with Apple"
				icon={AppleIcon}
			/>
			<AuthProviderButton
				onClick={() => {}}
				label="Sign in with X"
				icon={XIcon}
			/>
			<AuthProviderButton
				onClick={() => {}}
				label="Sign in with Email"
				icon={EmailIcon}
			/>
			<p className="mt-9 mb-12">
				No account?{" "}
				<button
					onClick={() => setIsLoginForm(false)}
					className="text-mango font-display-bold cursor-pointer"
				>
					Create one
				</button>
			</p>
			<p className="text-[#6B6B6B] text-sm mb-7">
				Forgot email or trouble signing in?{" "}
				<span className="underline">Get help</span>.
			</p>
			<p className="text-[#6B6B6B] text-sm text-center mb-12">
				Click “Sign in” to agree to Medium&apos;s Terms of Service and
				acknowledge that Medium&apos;s Privacy Policy applies to you.
			</p>
		</div>
	);
};

const RegisterUI = ({
	setIsLoginForm,
}: {
	setIsLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	return (
		<div className="flex flex-col items-center w-[80%] mx-auto">
			<h1 className="font-logo text-3xl mt-14 mb-16">Join Medium.</h1>
			<AuthProviderButton
				onClick={() => {}}
				label="Sign up with Google"
				icon={GoogleIcon}
			/>
			<AuthProviderButton
				onClick={() => {}}
				label="Sign up with Facebook"
				icon={FacebookIcon}
			/>
			<AuthProviderButton
				onClick={() => {}}
				label="Sign up with Email"
				icon={EmailIcon}
			/>
			<p className="mt-9 mb-28">
				Already have an account?{" "}
				<button
					onClick={() => setIsLoginForm(true)}
					className="text-mango font-display-bold cursor-pointer"
				>
					Sign in
				</button>
			</p>
			<p className="text-[#6B6B6B] text-sm text-center mb-12">
				Click “Sign up” to agree to Medium&apos;s Terms of Service and
				acknowledge that Medium&apos;s Privacy Policy applies to you.
			</p>
		</div>
	);
};

const AuthProviderButton = ({
	label,
	icon,
	onClick,
}: {
	label: string;
	icon: StaticImport;
	onClick: () => void;
}) => {
	return (
		<div
			onClick={onClick}
			className="relative py-2 mb-3 w-full max-w-[300px] rounded-full text-center shrink-0 border-black border-[1px]"
		>
			<Image
				src={icon}
				alt={`${label} icon`}
				width={25}
				height={25}
				className="absolute top-[50%] left-2 translate-y-[-50%]"
			/>
			{label}
		</div>
	);
};
