import { createGlobalState } from "@state";

export type PopupState = {
	active: boolean;
	position: { x: number; y: number };
};

export const useMentionPopupState = createGlobalState<PopupState>(
	"mentionBlockPopups",
	{
		active: false,
		position: { x: 0, y: 0 },
	}
);
