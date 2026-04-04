'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { get } from '@/lib/api';
import { Project, ApiResponse } from '@/lib/types';
import { toast } from 'sonner';

export default function EditProjectPage() {
    const { token, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [fetching, setFetching] = useState(true);

    // Fetch the existing project data to pre-fill the form
    useEffect(() => {
        if (!token) return;

        get<ApiResponse<Project>>(`/projects/${params.id}`)
            .then(res => setProject(res.data))
            .catch(() => {
                toast.error('Project not found');
                router.push('/dashboard');
            })
            .finally(() => setFetching(false));
    }, [token, params.id]);

    // Submit handler — uses PUT with multipart/form-data
    async function handleSubmit(formData: FormData) {
        // Laravel does not support PUT with multipart — use POST with _method override
        // This is called "method spoofing" — Laravel reads _method field
        formData.append('_method', 'PUT');

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/projects/${params.id}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message ?? 'Failed to update project');
        }

        toast.success('Project updated!');
        router.push('/dashboard');
    }

    if (loading || fetching) return null;
    if (!project) return null;

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
                {token && (
                    <ProjectForm
                        project={project}
                        token={token}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}
