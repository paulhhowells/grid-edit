# Grid edit

A small React 19 + Vite example using AG Grid and Zustand. The `Role` column is editable. Each edit is recorded by the `useEditedCells` hook in a Zustand reducer-backed store, and each row can be saved or restored with its action buttons.

## Run locally

```bash
npm install
npm run dev
```