import { useDogMode } from '~/utils/hooks';

export default function NotFound() {
	const { isDogModeEnabled } = useDogMode();

	return (
		<>
			<title>{isDogModeEnabled ? 'dogfol.io | Not Found' : 'catfol.io | Not Found'}</title>
			<div>
				<h1>404 - Not Found</h1>
				<p>The page you are looking for does not exist.</p>
			</div>
		</>
	);
}
