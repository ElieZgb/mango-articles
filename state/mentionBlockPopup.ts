import { createGlobalState } from "@state";

export type MentionPopupState = {
	active: boolean;
	position: { x: number; y: number };
	blockRef: React.RefObject<HTMLElement | null> | null;
	blockId: string | null;
};

export const useMentionPopupState = createGlobalState<MentionPopupState>(
	"mentionBlockPopups",
	{
		active: false,
		position: { x: 0, y: 0 },
		blockId: null,
		blockRef: null,
	}
);
