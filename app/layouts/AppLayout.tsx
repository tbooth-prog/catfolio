import { Cat, Dog, UploadIcon } from 'lucide-react';
import { Link, Outlet } from 'react-router';
import { Button, LinkButton } from '~/components/controls/Buttons';
import { useDogMode } from '~/utils/hooks';

export default function AppLayout() {
	const { isDogModeEnabled, toggleDogMode } = useDogMode();

	return (
		<div className="mx-auto flex min-h-dvh max-w-7xl flex-col border-x border-x-subtle dog:border-subtle-dark">
			<header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-subtle bg-surface px-6 py-5 dog:border-subtle-dark dog:bg-surface-dark">
				<Link to="/" className="font-logo text-3xl">
					{`${isDogModeEnabled ? 'dogfol' : 'catfol'}`}
					<span className="text-primary dog:text-primary-dark">.io</span>
				</Link>
				<div className="flex items-center gap-4">
					<Button variant="contrast" onClick={toggleDogMode}>
						<span className="hidden sm:block">{isDogModeEnabled ? 'Disable dog mode' : 'Enable dog mode'}</span>
						{isDogModeEnabled ? <Cat strokeWidth={1} className="size-5" /> : <Dog strokeWidth={1} className="size-5" />}
					</Button>
					<LinkButton to="/upload" className="shrink-0">
						<div className="flex items-center gap-2">
							<span className="hidden sm:block">{`Upload ${isDogModeEnabled ? 'Dog' : 'Cat'}`}</span>
							<UploadIcon strokeWidth={1} className="size-4" />
						</div>
					</LinkButton>
				</div>
			</header>
			<main className="flex flex-1 flex-col items-center p-6">
				<Outlet />
			</main>
			<footer></footer>
		</div>
	);
}
