import { createGlobalState } from "@state";

export type PopupState = {
	isOpen: boolean;
	email: string | null;
};

export const usePopupState = createGlobalState<PopupState>("popups", {
	isOpen: false,
	email: null,
});
