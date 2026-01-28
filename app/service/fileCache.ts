const fileCache = new Map<string, File>();

export const storeFile = (id: string, file: File) => {
	fileCache.set(id, file);
};

export const getFile = (id: string) => fileCache.get(id);

export const removeFile = (id: string) => {
	fileCache.delete(id);
};
