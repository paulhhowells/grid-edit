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
