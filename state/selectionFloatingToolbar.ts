import { createGlobalState } from "@state";

export type SelectionFloatingToolbarState = {
	position: { x: number; y: number } | null;
	active: boolean;
	blockRef: React.RefObject<HTMLElement | null> | null;
	blockId: string | null;
};

export const useSelectionFloatingToolbarState =
	createGlobalState<SelectionFloatingToolbarState>(
		"selectionFloatingToolbar",
		{
			active: false,
			position: null,
			blockRef: null,
			blockId: null,
		}
	);
