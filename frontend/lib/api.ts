// Base URL from environment variable — never hardcode URLs
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Custom error class to carry HTTP status code alongside the message
// This lets us handle 401, 404, 422 differently in the UI
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

// Generic fetch wrapper — handles JSON parsing and error throwing
// fetch() does NOT throw on 4xx/5xx — we must check response.ok manually
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Spread any extra headers (e.g. Authorization token)
            ...options.headers,
        },
    });

    // Parse response body — even errors return JSON from Laravel
    const data = await response.json();

    // Throw a typed error if the request failed
    // Without this check, fetch silently returns error responses as "success"
    if (!response.ok) {
        throw new ApiError(response.status, data.message ?? 'Request failed');
    }

    return data as T;
}

// GET request — used for public pages (projects list, single project)
export function get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
}

// POST request — used for login and create project
export function post<T>(endpoint: string, body: unknown, token?: string): Promise<T> {
    return request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

// PUT request — used for update project
export function put<T>(endpoint: string, body: unknown, token: string): Promise<T> {
    return request<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { Authorization: `Bearer ${token}` },
    });
}

// DELETE request — used for delete project
export function del<T>(endpoint: string, token: string): Promise<T> {
    return request<T>(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}
