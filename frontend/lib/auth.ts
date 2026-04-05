const TOKEN_KEY = 'devfolio_admin_token';

// Guard: localStorage only exists in the browser, not during SSR
function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

export function saveToken(token: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return getToken() !== null;
}
