import { createGlobalState } from "@state";

export type ModalState = {
	isOpen: boolean;
	type: number; // 1 for signin, 2 for register
	title: string | null;
};

export const useModalsState = createGlobalState<ModalState>("modals", {
	isOpen: false,
	type: 1,
	title: null,
});
