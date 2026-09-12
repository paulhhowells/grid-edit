export function ActionsCellRenderer (params) {
	return (
		params.context?.editedCells?.[params.data.id]
			? <RowActions data={params.data} context={params.context} />
			: null
	);
}

export function RowActions ({ data, context }) {
	return (
		<div className="row-actions">
			<button
				type="button"
				className="action-button save"
				onClick={() => context.onSave(data)}>
				Save
			</button>
			<button
				type="button"
				className="action-button undo"
				onClick={() => context.onUndo(data.id)}>
				Undo
			</button>
		</div>
	);
}
