import { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
	AllCommunityModule,
	ModuleRegistry,
	ValidationModule
} from 'ag-grid-community';

import { columnDefs } from './columnDefs';
import { useEditedCells } from './hooks/useEditedCells';
import { useSaveEditedRow } from './hooks/useSaveEditedRow';
import { useTeamRecords } from './hooks/useTeamRecords';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './App.css';

ModuleRegistry.registerModules([
	AllCommunityModule,
	ValidationModule,
]);

function App() {
	const [rowOverrides, setRowOverrides] = useState({});
	const gridRef = useRef(null);
	const { editedCells, recordEdit, clearRow } = useEditedCells();
	const { mutate: saveEditedRow } = useSaveEditedRow();
	const { data: initialRows = [], isLoading, isError } = useTeamRecords();

	// Does this enable keeping edits when the query cache refreshes?
	// TODO add a test to document this.
	const rows = initialRows.map((row) => ({ ...row, ...rowOverrides[row.id] }));

	useEffect(() => {
		gridRef.current?.api.refreshCells({
			columns: ['role'],
			force: true,
		});
	}, [editedCells]);

	const handleCellValueChanged = ({ data, colDef, newValue, oldValue }) => {
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
	};

	const handleUndo = (rowId) => {
		setRowOverrides((currentOverrides) => {
			const nextOverrides = { ...currentOverrides };
			delete nextOverrides[rowId];
			return nextOverrides;
		});
		clearRow(rowId);
	};

	const handleSave = (editedRow) => {
		saveEditedRow(editedRow, {
			onSuccess: () => clearRow(editedRow.id),
		});
	};

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
					<span>{Object.keys(editedCells).length} unsaved {Object.keys(editedCells).length === 1 ? 'row' : 'rows'}</span>
				</div>
			</header>

			<section className="grid-panel" aria-label="Editable team records">
				<div className="grid-toolbar">
					<span className="grid-label">Directory</span>
					<span className="grid-hint">Role is editable</span>
				</div>
				{isLoading && <div className="grid-state">Loading team records...</div>}
				{isError && <div className="grid-state error">Could not load team records.</div>}
				{!isLoading && !isError && (
					<div className="ag-theme-quartz grid-wrapper">
						<AgGridReact
							ref={gridRef}
							rowData={rows}
							columnDefs={columnDefs}
							context={{
								onSave: handleSave,
								onUndo: handleUndo,
								editedCells,
							}}
							onCellValueChanged={handleCellValueChanged}
							getRowId={({ data }) => String(data.id)}
							headerHeight={52}
							rowHeight={64}
							animateRows
						/>
					</div>
				)}
			</section>
		</main>
	);
}

export default App;
