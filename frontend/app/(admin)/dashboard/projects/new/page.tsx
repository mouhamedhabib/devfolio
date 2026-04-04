'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { toast } from 'sonner';

export default function NewProjectPage() {
    const { token, loading } = useAuth();
    const router = useRouter();

    // Submit handler — sends multipart/form-data to support image upload
    async function handleSubmit(formData: FormData) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/projects`, {
            method: 'POST',
            headers: {
                // Do NOT set Content-Type here — browser sets it with boundary for multipart
                'Authorization': `Bearer ${token}`,
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
                {token && <ProjectForm token={token} onSubmit={handleSubmit} />}
            </div>
        </div>
    );
}
