import { useDogMode } from '~/utils/hooks';

export default function NotFound() {
	const { isDogModeEnabled } = useDogMode();

	return (
		<>
			<title>{isDogModeEnabled ? 'dogfol.io | Not Found' : 'catfol.io | Not Found'}</title>
			<main className="flex h-dvh w-full flex-col items-center justify-center">
				<h1 className="font-bold">404 - Not Found</h1>
				<p>The page you are looking for does not exist.</p>
			</main>
		</>
	);
}
