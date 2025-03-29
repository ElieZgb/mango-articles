import { createGlobalState } from "@state";

export type MentionPopupState = {
	active: boolean;
	position: { x: number; y: number };
};

export const useMentionPopupState = createGlobalState<MentionPopupState>(
	"mentionBlockPopups",
	{
		active: false,
		position: { x: 0, y: 0 },
	}
);
