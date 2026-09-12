import { useEditedCellsStore } from '../store/editedCellsStore';

export function useEditedCells() {
	const editedCells = useEditedCellsStore((state) => state.editedCells);
	const dispatch = useEditedCellsStore((state) => state.dispatch);

	return {
		editedCells,
		recordEdit: (rowId, field, value, previousValue) =>
			dispatch({ type: 'record', rowId, field, value, previousValue }),
		clearRow: (rowId) => dispatch({ type: 'clear-row', rowId }),
	};
}
