import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const initialState = { editedCells: {} };

export function editedCellsReducer(state, action) {
	switch (action.type) {
		case 'record':
			return {
				...state,
				editedCells: {
					...state.editedCells,
					[action.rowId]: {
						...state.editedCells[action.rowId],
						[action.field]: { value: action.value, previousValue: action.previousValue },
					},
				},
			};
		case 'clear-row': {
			const editedCells = { ...state.editedCells };
			delete editedCells[action.rowId];
			return { ...state, editedCells };
		}
		default:
			return state;
	}
}

export const useEditedCellsStore = create(
	devtools(
		(set) => ({
			...initialState,
			dispatch: (action) => set((state) => editedCellsReducer(state, action)),
		})
	)
);
