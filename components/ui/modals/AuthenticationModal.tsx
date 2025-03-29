"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import CloseButton from "../buttons/CloseButton";

import FacebookIcon from "@public/assets/icons/facebook-icon.svg";
import GoogleIcon from "@public/assets/icons/google-icon.svg";
// import XIcon from "@public/assets/icons/x-icon.svg";
// import EmailIcon from "@public/assets/icons/email-icon.svg";
// import AppleIcon from "@public/assets/icons/apple-icon.svg";

import Image from "@node_modules/next/image";
import type { StaticImport } from "@node_modules/next/dist/shared/lib/get-img-props";
import { signIn } from "@node_modules/next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type SignInRegisterModalState,
	useSignInRegisterModalState,
} from "@state/signInRegisterModals";
import { useRouter } from "@node_modules/next/navigation";
import { signInSchema, type SignInSchema } from "@schema/signInSchema";
import { type SignUpSchema, signUpSchema } from "@schema/signUpSchema";
import { checkUsernameAvailability } from "@lib/checkUsernameAvailability";
import { Loader2, CircleCheck, XCircle } from "lucide-react";

export default function AuthenticationModal() {
	const [hidden, setHidden] = useState(true);
	const { data: modalState, setData: setModalData } =
		useSignInRegisterModalState();

	useEffect(() => {
		if (modalState?.isOpen) {
			if (document) {
				document.body.style.overflow = "hidden";
			}
			setHidden(false);
		} else {
			if (document) {
				document.body.style.overflow = "unset";
			}
		}
	}, [modalState]);

	const closeModal = () => {
		setModalData({ ...modalState, isOpen: false });
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
				modalState?.isOpen && "modal_fade_in z-50",
				!modalState?.isOpen && "modal_fade_out -z-50",
			])}
		>
			<div
				className="absolute top-0 left-0 w-full h-full"
				onClick={closeModal}
			/>
			<div
				className={clsx([
					"relative w-[70%] max-w-[678px] bg-white modal_box_shadow",
					modalState?.isOpen && "modal_content_fade_in",
					!modalState?.isOpen && "modal_content_fade_out",
				])}
			>
				<CloseButton
					closeModal={closeModal}
					className="cursor-pointer absolute top-4 right-4"
				/>
				{modalState?.type == 1 ? (
					<LoginUI
						setModalData={setModalData}
						title={modalState?.title}
					/>
				) : (
					<RegisterUI
						setModalData={setModalData}
						title={modalState?.title}
					/>
				)}
			</div>
		</div>
	);
}

interface FormProps {
	setModalData: (data: Partial<SignInRegisterModalState>) => void;
	title: string | null | undefined;
}

const LoginUI = ({ setModalData, title }: FormProps) => {
	const { handleSubmit, register } = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const router = useRouter();

	const onSubmit = async (data: SignInSchema) => {
		try {
			const account = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (!account) throw new Error("Something went wrong");

			if (account.error == "CredentialsSignin") {
				console.log("Wrong credentials");
			} else {
				console.log("You are signed in!");
				router.push("/");
				setModalData({ isOpen: false });
			}
		} catch (e) {
			console.log("Error", e);
		}
	};

	return (
		<div className="flex flex-col items-center w-[80%] mx-auto">
			<h1 className="font-logo text-3xl mt-14 mb-16">
				{title ? title : "Welcome Back."}
			</h1>
			<AuthProviderButton
				onClick={() => {
					signIn("google");
				}}
				label="Sign in with Google"
				icon={GoogleIcon}
			/>
			<AuthProviderButton
				onClick={() => {
					signIn("facebook");
				}}
				label="Sign in with Facebook"
				icon={FacebookIcon}
			/>
			<div className="w-full max-w-[300px] mb-3 border-t-[1px] border-black border-dashed" />
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col w-full max-w-[300px]"
			>
				<input
					className="border-[1px] border-black py-1 px-3 outline-none mb-3 rounded-full"
					{...register("email")}
					type="email"
					placeholder="Email"
				/>
				<input
					className="border-[1px] border-black py-1 px-3 outline-none mb-3 rounded-full"
					{...register("password")}
					type="password"
					placeholder="Password"
				/>
				<input
					type="submit"
					value="Sign in"
					className="py-1 px-3 outline-none mb-3 rounded-full bg-mango cursor-pointer"
				/>
			</form>

			<p className="mt-9 mb-12">
				No account?{" "}
				<button
					onClick={() => setModalData({ isOpen: true, type: 2 })}
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

const RegisterUI = ({ setModalData, title }: FormProps) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean | null>(null);
	const {
		handleSubmit,
		watch,
		register,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirm_password: "",
			name: "",
			username: "",
		},
	});
	const router = useRouter();
	const usernameInput = watch("username");

	useEffect(() => {
		setLoading(false);
		setSuccess(null);
		if (!usernameInput.trim()) return;

		const timeout = setTimeout(() => {
			setLoading(true);
			checkUsernameAvailability(usernameInput).then((isAvailable) => {
				setSuccess(isAvailable);
				setLoading(false);
			});
		}, 800);

		return () => clearTimeout(timeout);
	}, [usernameInput]);

	const onSubmit = async (data: SignUpSchema) => {
		if (!success) return;
		if (data.password !== data.confirm_password) {
			setError(
				"confirm_password",
				{ message: "Passwords do not match!" },
				{ shouldFocus: true }
			);
			return console.log("Password missmatch");
		}

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok)
				throw new Error(`Something went wrong: ${res.statusText}`);

			const signUpInfo = await res.json();

			if (res.status === 200) {
				await signIn("credentials", {
					email: data.email,
					password: data.password,
					redirect: false,
				});
				router.push("/");
				setModalData({ isOpen: false });
			} else throw new Error(signUpInfo);
		} catch (e) {
			console.log("Error signing up", e);
		}
	};

	return (
		<div className="flex flex-col items-center w-[80%] mx-auto">
			<h1 className="font-logo text-3xl mt-14 mb-16">
				{title ? title : "Join Medium."}
			</h1>
			<AuthProviderButton
				onClick={() => {
					signIn("google");
				}}
				label="Sign up with Google"
				icon={GoogleIcon}
			/>
			<AuthProviderButton
				onClick={() => {
					signIn("facebook");
				}}
				label="Sign up with Facebook"
				icon={FacebookIcon}
			/>
			<div className="w-full max-w-[300px] mb-3 border-t-[1px] border-black border-dashed" />
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col w-full max-w-[300px]"
			>
				<input
					className="border-[1px] border-black py-1 px-3 outline-none mb-3 rounded-full"
					{...register("name")}
					type="text"
					placeholder="Full Name"
				/>
				<div
					className={clsx(
						"relative mb-3 border-[1px] rounded-full",
						success && "border-green-500",
						success == false && "border-red-500"
					)}
				>
					<input
						className="w-full py-1 px-3 outline-none"
						{...register("username")}
						type="text"
						placeholder="Username"
					/>
					<Loader2
						size={20}
						className={`absolute top-[50%] translate-y-[-50%] right-2 animate-spin invisible ${
							loading && "visible"
						}`}
						color="#191919"
					/>
					<CircleCheck
						size={20}
						className={`absolute top-[50%] translate-y-[-50%] right-2 invisible ${
							success && "visible"
						}`}
						color="oklch(0.723 0.219 149.579)"
					/>
					<XCircle
						size={20}
						className={`absolute top-[50%] translate-y-[-50%] right-2 invisible ${
							success == false && "visible"
						}`}
						color="#fb2c36"
					/>
				</div>
				<input
					className="border-[1px] border-black py-1 px-3 outline-none mb-3 rounded-full"
					{...register("email")}
					type="email"
					placeholder="Email"
				/>
				<input
					className={clsx(
						"border-[1px] border-black py-1 px-3 outline-none mb-3 rounded-full"
					)}
					{...register("password")}
					type="password"
					placeholder="Password"
				/>
				<input
					className={clsx(
						"border-[1px] border-black py-1 px-3 outline-none mb-3 rounded-full",
						errors.confirm_password && "border-red-500"
					)}
					{...register("confirm_password")}
					type="password"
					placeholder="Confirm Password"
					onChange={() => clearErrors("confirm_password")}
				/>
				<input
					type="submit"
					value="Sign Up"
					className="py-1 px-3 outline-none mb-3 rounded-full bg-mango cursor-pointer"
				/>
			</form>
			<p className="mt-9 mb-12">
				Already have an account?{" "}
				<button
					onClick={() => setModalData({ isOpen: true, type: 1 })}
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
			className="relative py-2 mb-3 w-full max-w-[300px] rounded-full text-center shrink-0 border-black border-[1px] cursor-pointer"
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
