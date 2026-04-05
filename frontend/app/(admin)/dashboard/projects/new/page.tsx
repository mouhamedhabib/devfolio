'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { getToken } from '@/lib/auth';
import { toast } from 'sonner';

export default function NewProjectPage() {
    const { loading } = useAuth();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        // Read token at call time — not at definition time
        // This avoids stale closure issues with token being null
        const currentToken = getToken();

        if (!currentToken) {
            toast.error('Not authenticated');
            router.replace('/login');
            return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/projects`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message ?? 'Failed to create project');
        }

        toast.success('Project created!');
        router.push('/dashboard');
    }

    if (loading) return null;

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">New Project</h1>
                <ProjectForm token="" onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
