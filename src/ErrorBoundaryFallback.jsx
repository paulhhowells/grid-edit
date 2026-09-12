import { getErrorMessage } from 'react-error-boundary';

export function ErrorBoundaryFallback ({ error, resetErrorBoundary }) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre>{ getErrorMessage(error) }</pre>
			<button onClick={ resetErrorBoundary }>Try again</button>
		</div>
	);
}
