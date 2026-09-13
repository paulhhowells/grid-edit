import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
	AllCommunityModule,
	ModuleRegistry,
	ValidationModule,
	themeBalham,
} from 'ag-grid-community';

import { columnDefs } from './columnDefs';
import { useEditedCells } from './hooks/useEditedCells';
import { useSaveEditedRow } from './hooks/useSaveEditedRow';
import { useTeamRecords } from './hooks/useTeamRecords';

import './App.css';

ModuleRegistry.registerModules([
	AllCommunityModule,
	ValidationModule,
]);

const getRowId = ({ data }) => String(data.id);

function App () {
	const [ rowOverrides, setRowOverrides ] = useState({});
	const gridRef = useRef(null);
	const { editedCells, recordEdit, clearRow } = useEditedCells();
	const editedCellsLength = Object.keys(editedCells).length;

	const { mutate: saveEditedRow } = useSaveEditedRow();
	const { data: initialRows = [], isLoading, isError } = useTeamRecords();

	// Does this enable keeping edits when the query cache refreshes?
	// TODO add a test to document this.
	const rows = initialRows.map((row) => ({ ...row, ...rowOverrides[row.id] }));

	useEffect(() => {
		const hasEdits = Boolean(editedCellsLength > 0);

		gridRef.current?.api.setColumnsVisible([ 'actions' ], hasEdits);

		gridRef.current?.api.refreshCells({
			columns: [ 'role', 'actions' ],
			force: true,
		});
	}, [ editedCellsLength ]);

	const handleCellValueChanged = useCallback(({ data, colDef, newValue, oldValue }) => {
		// Ignore when the grid is first initialised.
		if (oldValue === undefined) {
			return;
		}

		// TODO probably ought to update the store when the cell has returned to an unchanged value.
		if (newValue === oldValue || !colDef.field) {
			return;
		}

		setRowOverrides((currentOverrides) => ({
			...currentOverrides,
			[data.id]: { ...currentOverrides[data.id], [colDef.field]: newValue },
		}));

		recordEdit(data.id, colDef.field, newValue, oldValue);
	}, [ recordEdit ]);

	const handleUndo = useCallback((rowId) => {
		setRowOverrides((currentOverrides) => {
			const nextOverrides = { ...currentOverrides };

			delete nextOverrides[rowId];

			return nextOverrides;
		});
		clearRow(rowId);
	}, [ clearRow ]);

	const handleSave = useCallback((editedRow) => {
		saveEditedRow(editedRow, {
			onSuccess: () => clearRow(editedRow.id),
		});
	}, [ clearRow, saveEditedRow ]);

	const gridContext = useMemo(() => ({
		onSave: handleSave,
		onUndo: handleUndo,
		editedCells,
	}), [ editedCells, handleSave, handleUndo ]);

	return (
		<main className="app-shell">
			<header className="page-header">
				<div>
					<p className="eyebrow">People directory / live dataset</p>
					<h1>Team records</h1>
					<p className="intro">Edit a role in place, then save or undo the row.</p>
				</div>
				<div className="edit-summary">
					<span className="summary-dot" aria-hidden="true" />
					<span>{ editedCellsLength } unsaved { editedCellsLength === 1 ? 'row' : 'rows'}</span>
				</div>
			</header>

			<section className="grid-panel" aria-label="Editable team records">
				<div className="grid-toolbar">
					<span className="grid-label">Directory</span>
					<span className="grid-hint">Role is editable</span>
				</div>
				{isLoading ? <div className="grid-state">Loading team records...</div> : null}
				{isError ? <div className="grid-state error">Could not load team records.</div> : null}
				{
					(!isLoading && !isError)
						? (
							<div className="grid-wrapper">
								<AgGridReact
									ref={gridRef}
									rowData={rows}
									columnDefs={columnDefs}
									context={gridContext}
									onCellValueChanged={handleCellValueChanged}
									getRowId={getRowId}
									// headerHeight={52}
									// rowHeight={64}
									theme={themeBalham}
									animateRows
								/>
							</div>
						)
						: null
				}
			</section>
		</main>
	);
}

export default App;
