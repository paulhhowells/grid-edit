import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { worker } from './mocks/browser.js';

import App from './App';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';

import './index.css';

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

worker
	.start({ onUnhandledRequest: 'bypass' })
	.then(
		() => createRoot(document.getElementById('root')).render(<Root />),
	);

export function Root () {
	return (
		<StrictMode>
			<ErrorBoundary fallbackRender={ ErrorBoundaryFallback }>
				<QueryClientProvider client={ queryClient }>
					<App />
					<ReactQueryDevtools initialIsOpen={ false } />
				</QueryClientProvider>
			</ErrorBoundary>
		</StrictMode>
	);
}
