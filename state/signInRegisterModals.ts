import { createGlobalState } from "@state";

export type SignInRegisterModalState = {
	isOpen: boolean;
	type: number; // 1 for signin, 2 for register
	title: string | null;
};

export const useSignInRegisterModalState =
	createGlobalState<SignInRegisterModalState>("signInRegisterModal", {
		isOpen: false,
		type: 1,
		title: null,
	});
