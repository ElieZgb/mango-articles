import { createGlobalState } from "@state";

export type BlockTooltipState = {
	visible: boolean;
	position: {
		x: number | null;
		y: number | null;
	};
	blockId: string | null;
};

export const useBlockTooltipState = createGlobalState<BlockTooltipState>(
	"blockTooltipState",
	{
		visible: false,
		position: { x: null, y: null },
		blockId: null,
	}
);
