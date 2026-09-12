import { RowActions } from './RowActions';

export const columnDefs = [
	{ field: 'name', headerName: 'Name', flex: 1.4, minWidth: 180 },
	{
		field: 'role',
		headerName: 'Role',
		flex: 1.1,
		minWidth: 150,
		editable: true,
		cellClass: (params) => {
			const editedRow = params.context?.editedCells?.[params.data.id];

			return (
				editedRow?.[params.colDef.field]
					? ['editable-cell', 'edited-cell']
					: 'editable-cell'
			);
		},
	},
	{ field: 'team', headerName: 'Team', flex: 1.2, minWidth: 160 },
	{ field: 'status', headerName: 'Status', flex: 0.9, minWidth: 130 },
	{
		headerName: 'Actions',
		field: 'actions',
		width: 168,
		sortable: false,
		filter: false,
		cellRenderer: RowActions,
	},
];
