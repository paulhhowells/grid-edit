import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PUSH_ROWS_API } from '../constants';

export function useSaveEditedRow() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (editedRow) => {
			const response = await fetch(PUSH_ROWS_API, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editedRow),
			});

			if (!response.ok) {
				throw new Error('Unable to save edited row');
			}

			return response.json();
		},
		onSuccess: ({ row }) => {
			// Keep the visible query data in sync with the row returned by the server.
			queryClient.setQueryData(['team-records'], (currentRows = []) =>
				currentRows.map((currentRow) => (currentRow.id === row.id ? row : currentRow)),
			);
			queryClient.invalidateQueries({ queryKey: ['team-records'] });
		},
	});
}
