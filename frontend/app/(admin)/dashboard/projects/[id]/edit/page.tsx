'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { get } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Project, ApiResponse } from '@/lib/types';
import { toast } from 'sonner';

export default function EditProjectPage() {
    const { loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (loading) return;

        get<ApiResponse<Project>>(`/projects/${params.id}`)
            .then(res => setProject(res.data))
            .catch(() => {
                toast.error('Project not found');
                router.push('/dashboard');
            })
            .finally(() => setFetching(false));
    }, [loading, params.id]);

    async function handleSubmit(formData: FormData) {
        // Read token at call time to avoid stale closure
        const currentToken = getToken();

        if (!currentToken) {
            toast.error('Not authenticated');
            router.replace('/login');
            return;
        }

        // Method spoofing — Laravel does not support PUT with multipart
        formData.append('_method', 'PUT');

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/projects/${params.id}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
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
                <ProjectForm project={project} token="" onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
