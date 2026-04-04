'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { post } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import { AuthResponse, LoginCredentials } from '@/lib/types';

export default function LoginPage() {
    const router = useRouter();

    // Form state — controlled inputs
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
    });

    // Loading state — disable button while request is in flight
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // POST /api/auth/login — returns token on success
            const res = await post<AuthResponse>('/auth/login', credentials);

            // Save token to localStorage for future requests
            saveToken(res.token);

            toast.success('Welcome back!');

            // Redirect to admin dashboard
            router.push('/dashboard');

        } catch (err: unknown) {
            // Show error message from Laravel (e.g. "Invalid credentials")
            const message = err instanceof Error ? err.message : 'Login failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md space-y-8 p-8 border rounded-xl shadow-sm">

                <div className="text-center">
                    <h1 className="text-2xl font-bold">Admin Login</h1>
                    <p className="text-muted-foreground mt-2">DevFolio Dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@devfolio.com"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
