import { createContext, useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import { ApiClient } from '~/service/apiClient';
import { resetApp } from '~/store';
import { THEME_KEY } from '~/utils';

interface DogModeContextType {
	isDogModeEnabled: boolean;
	toggleDogMode: () => void;
}

export const DogModeContext = createContext<DogModeContextType | undefined>(undefined);

interface DogModeProviderProps {
	initialValue?: boolean;
}

export const DogModeProvider = (props: PropsWithChildren<DogModeProviderProps>) => {
	const { initialValue } = props;

	const [isDogModeEnabled, setIsDogModeEnabled] = useState<boolean>(initialValue ?? false);

	const toggleDogMode = useCallback(() => {
		resetApp();
		setIsDogModeEnabled((prevMode) => {
			const newMode = !prevMode;
			const theme = newMode ? 'dog' : 'cat';

			document.documentElement.dataset.theme = theme;
			localStorage.setItem(THEME_KEY, theme);

			ApiClient.switchInstance(theme);
			return newMode;
		});
	}, []);

	return <DogModeContext.Provider value={{ isDogModeEnabled, toggleDogMode }}>{props.children}</DogModeContext.Provider>;
};
