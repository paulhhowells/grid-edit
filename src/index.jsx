import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { worker } from './mocks/browser.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary, getErrorMessage } from 'react-error-boundary';

const queryClient = new QueryClient();

// TanStack Query Devtools
window.__TANSTACK_QUERY_CLIENT__ = queryClient;
// This code is only for TanStack TypeScript
// declare global {
//   interface Window {
//     __TANSTACK_QUERY_CLIENT__:
//       import('@tanstack/query-core').QueryClient
//   }
// }

worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
	createRoot(document.getElementById('root')).render(
		<StrictMode>
			<ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
				<div role="alert">
					<p>Something went wrong:</p>
					<pre>{getErrorMessage(error)}</pre>
					<button onClick={resetErrorBoundary}>Try again</button>
				</div>
			)}
			>
				<QueryClientProvider client={queryClient}>
					<App />
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</ErrorBoundary>
		</StrictMode>,
	);
});
