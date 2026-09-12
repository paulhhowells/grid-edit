import { useQuery } from '@tanstack/react-query';
import { GET_ROWS_API } from '../constants';

export function useTeamRecords() {
	return useQuery({
		queryKey: ['team-records'],
		queryFn: async () => {
			const response = await fetch(GET_ROWS_API);
			if (!response.ok) {
				throw new Error('Unable to load team records');
			}
			return response.json();
		},
	});
}
