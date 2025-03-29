import { createGlobalState } from "@state";

export type SelectionFloatingToolbarState = {
	position: { x: number; y: number } | null;
	active: boolean;
};

export const useSelectionFloatingToolbarState =
	createGlobalState<SelectionFloatingToolbarState>(
		"selectionFloatingToolbar",
		{
			active: false,
			position: null,
		}
	);
