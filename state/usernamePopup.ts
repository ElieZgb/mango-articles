import { createGlobalState } from "@state";

export type UsernamePopupState = {
	isOpen: boolean;
	email: string | null;
};

export const useUsernamePopupState = createGlobalState<UsernamePopupState>(
	"usernamePopup",
	{
		isOpen: false,
		email: null,
	}
);
