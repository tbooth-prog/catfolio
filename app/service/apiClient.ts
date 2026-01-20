import { TheCatAPI } from "@thatapicompany/thecatapi";

type ApiType = "cat" | "dog";

interface ApiInstance {
  client: TheCatAPI;
  type: ApiType;
}

export class ApiClient {
  private static instance: ApiInstance;

  private static createInstance(type: ApiType): ApiInstance {
    let client: TheCatAPI;
    if (type === "cat") {
      client = new TheCatAPI(import.meta.env.VITE_CAT_API_KEY);
    } else {
      client = new TheCatAPI(import.meta.env.VITE_DOG_API_KEY, {
        host: "https://api.thedogapi.com/v1",
      });
    }
    return { client, type };
  }

  static initClient(type: ApiType) {
    if (!this.instance) {
      this.instance = this.createInstance(type);
    }
  }

  static getClient(): TheCatAPI {
    return this.instance.client;
  }

  static switchInstance(type: ApiType = "cat"): ApiInstance {
    // If the type has changed, create a new instance
    if (this.instance.type !== type) {
      this.instance = this.createInstance(type);
    }

    return this.instance;
  }
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type HttpHeaders = Record<string, string>;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultHeaders: Record<string, string> = {};

async function retryFetch(fetchFn: () => Promise<Response>): Promise<Response> {
  let attempt = 0;
  const maxAttempts = 5;

  while (attempt < maxAttempts) {
    const response = await fetchFn();
    if (response.status !== 429) {
      return response;
    }
    // Handle 429 Too Many Requests
    const retryAfter = response.headers.get("Retry-After");
    const delay = retryAfter
      ? parseInt(retryAfter, 10) * 1000
      : 1000 * Math.pow(2, attempt); // Exponential backoff

    await new Promise((resolve) => setTimeout(resolve, delay));
    attempt++;
  }

  throw new Error(
    `Failed after ${maxAttempts} attempts due to repeated 429 responses.`,
  );
}

async function request<T>(
  url: string,
  method: HttpMethod,
  body?: unknown,
  customHeaders?: HttpHeaders,
  requireAuth: boolean = true,
): Promise<T> {
  const headers: HttpHeaders = {
    "Content-Type": "application/json",
    ...defaultHeaders,
    ...customHeaders,
  };

  // Only add Authorization header if required
  if (requireAuth) {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

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

export function apiAnonymousGet<T>(
  endpoint: string,
  customHeaders?: HttpHeaders,
) {
  const url = `${apiBaseUrl}${endpoint}`;
  return request<T>(url, "GET", undefined, customHeaders, false);
}

export function apiGet<T>(endpoint: string, customHeaders?: HttpHeaders) {
  const url = `${apiBaseUrl}${endpoint}`;
  return request<T>(url, "GET", undefined, customHeaders);
}

export function apiAnonymousPost<T>(
  endpoint: string,
  body: unknown,
  customHeaders?: HttpHeaders,
) {
  const url = `${apiBaseUrl}${endpoint}`;
  return request<T>(url, "POST", body, customHeaders, false);
}

export function apiPost<T>(
  endpoint: string,
  body: unknown,
  customHeaders?: HttpHeaders,
) {
  const url = `${apiBaseUrl}${endpoint}`;
  return request<T>(url, "POST", body, customHeaders);
}

export function apiPut<T>(
  endpoint: string,
  body: unknown,
  customHeaders?: HttpHeaders,
) {
  const url = `${apiBaseUrl}${endpoint}`;
  return request<T>(url, "PUT", body, customHeaders);
}

export function apiPatch<T>(
  endpoint: string,
  body: unknown,
  customHeaders?: HttpHeaders,
) {
  const url = `${apiBaseUrl}${endpoint}`;
  return request<T>(url, "PATCH", body, customHeaders);
}

export function apiDelete<T>(
  endpoint: string,
  body?: unknown,
  customHeaders?: HttpHeaders,
) {
  const url = `${apiBaseUrl}${endpoint}`;
  return request<T>(url, "DELETE", body, customHeaders);
}
