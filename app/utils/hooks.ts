import { useContext } from 'react';
import { DogModeContext } from '~/context/dogModeContext';

export function useDogMode() {
	const context = useContext(DogModeContext);
	if (!context) {
		throw new Error('useApiMode must be used within an DogModeProvider');
	}
	return context;
}
