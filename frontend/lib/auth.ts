// Token key used in localStorage
const TOKEN_KEY = 'devfolio_admin_token';

// Save token to localStorage after successful login
export function saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

// Get token from localStorage — returns null if not logged in
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

// Remove token from localStorage on logout
export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

// Check if admin is currently logged in
export function isAuthenticated(): boolean {
    return getToken() !== null;
}
