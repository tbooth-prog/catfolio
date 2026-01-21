import { TheCatAPI } from '@thatapicompany/thecatapi';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type HttpHeaders = Record<string, string>;

type ApiType = 'cat' | 'dog';

interface ApiInstance {
	client: TheCatAPI;
	type: ApiType;
	baseUrl: string;
	apiKey: string;
}

export class ApiClient {
	private static instance: ApiInstance;

	private static createInstance(type: ApiType): ApiInstance {
		const baseUrl = type === 'cat' ? import.meta.env.VITE_CAT_API_BASE_URL : import.meta.env.VITE_DOG_API_BASE_URL;
		const apiKey = type === 'cat' ? import.meta.env.VITE_CAT_API_KEY : import.meta.env.VITE_DOG_API_KEY;

		const client = new TheCatAPI(apiKey, {
			host: baseUrl,
		});

		return { client, type, baseUrl, apiKey };
	}

	static initClient(type: ApiType) {
		if (!this.instance) {
			this.instance = this.createInstance(type);
		}
	}

	static getClient(): TheCatAPI {
		return this.instance.client;
	}

	static getBaseUrl(): string {
		return this.instance.baseUrl;
	}

	static getApiKey(): string {
		return this.instance.apiKey;
	}

	static switchInstance(type: ApiType = 'cat'): ApiInstance {
		// If the type has changed, create a new instance
		if (this.instance.type !== type) {
			this.instance = this.createInstance(type);
		}

		return this.instance;
	}
}

async function retryFetch(fetchFn: () => Promise<Response>): Promise<Response> {
	let attempt = 0;
	const maxAttempts = 5;

	while (attempt < maxAttempts) {
		const response = await fetchFn();
		if (response.status !== 429) {
			return response;
		}
		// Handle 429 Too Many Requests
		const retryAfter = response.headers.get('Retry-After');
		const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * Math.pow(2, attempt); // Exponential backoff

		await new Promise((resolve) => setTimeout(resolve, delay));
		attempt++;
	}

	throw new Error(`Failed after ${maxAttempts} attempts due to repeated 429 responses.`);
}

async function request<T>(url: string, method: HttpMethod, body?: unknown, customHeaders?: HttpHeaders): Promise<T> {
	const headers: HttpHeaders = {
		'Content-Type': 'application/json',
		'x-api-key': ApiClient.getApiKey(),
		...customHeaders,
	};

	const response = await retryFetch(() =>
		fetch(url, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		}),
	);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`API error: ${response.status} ${error}`);
	}

	if (response.status === 204) return {} as T; // No Content

	return response.json();
}

export function apiGet<T>(endpoint: string, customHeaders?: HttpHeaders) {
	const url = `${ApiClient.getBaseUrl()}${endpoint}`;
	return request<T>(url, 'GET', undefined, customHeaders);
}

export function apiPost<T>(endpoint: string, body: unknown, customHeaders?: HttpHeaders) {
	const url = `${ApiClient.getBaseUrl()}${endpoint}`;
	return request<T>(url, 'POST', body, customHeaders);
}

export function apiPut<T>(endpoint: string, body: unknown, customHeaders?: HttpHeaders) {
	const url = `${ApiClient.getBaseUrl()}${endpoint}`;
	return request<T>(url, 'PUT', body, customHeaders);
}

export function apiPatch<T>(endpoint: string, body: unknown, customHeaders?: HttpHeaders) {
	const url = `${ApiClient.getBaseUrl()}${endpoint}`;
	return request<T>(url, 'PATCH', body, customHeaders);
}

export function apiDelete<T>(endpoint: string, body?: unknown, customHeaders?: HttpHeaders) {
	const url = `${ApiClient.getBaseUrl()}${endpoint}`;
	return request<T>(url, 'DELETE', body, customHeaders);
}
