import { http, HttpResponse } from 'msw';
import { GET_ROWS_API, PUSH_ROWS_API } from '../constants';

const teamRecords = [
	{ id: 1, name: 'Ada Lovelace', role: 'Engineer', team: 'Platform', status: 'Active' },
	{ id: 2, name: 'Grace Hopper', role: 'Admiral', team: 'Infrastructure', status: 'Active' },
	{ id: 3, name: 'Katherine Johnson', role: 'Mathematician', team: 'Research', status: 'On leave' },
	{ id: 4, name: 'Margaret Hamilton', role: 'Director', team: 'Flight software', status: 'Active' },
];

export const handlers = [
	http.get(GET_ROWS_API, () => HttpResponse.json(teamRecords)),
	http.post(PUSH_ROWS_API, async ({ request }) => {
		const editedRow = await request.json();

		return HttpResponse.json(
			{ saved: true, row: editedRow },
			{ status: 201 },
		);
	}),
];
