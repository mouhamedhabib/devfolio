'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { get, del } from '@/lib/api';
import { Project, ApiResponse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardPage() {
    const { token, loading, logout } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [fetching, setFetching] = useState(true);

    // Fetch all projects when token is ready
    useEffect(() => {
        if (!token) return;
        fetchProjects();
    }, [token]);

    async function fetchProjects() {
        try {
            const res = await get<ApiResponse<Project[]>>('/projects');
            setProjects(res.data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load projects';
            toast.error(message);
        } finally {
            setFetching(false);
        }
    }

    async function handleDelete(id: number) {
        if (!token) return;

        // Confirm before deleting — simple but effective UX
        if (!confirm('Delete this project?')) return;

        try {
            await del(`/admin/projects/${id}`, token);
            // Remove from local state without refetching
            setProjects(projects.filter(p => p.id !== id));
            toast.success('Project deleted');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Delete failed';
            toast.error(message);
        }
    }

    // Show nothing while checking auth — prevents flash of content
    if (loading) return null;

    return (
        <div className="min-h-screen bg-background">

            {/* Header */}
            <header className="border-b px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">DevFolio Admin</h1>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/projects/new">
                        <Button size="sm">+ New Project</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </header>

            {/* Content */}
            <main className="p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">Projects</h2>
                    <p className="text-muted-foreground">{projects.length} total</p>
                </div>

                {fetching ? (
                    <p className="text-muted-foreground">Loading...</p>
                ) : projects.length === 0 ? (
                    <p className="text-muted-foreground">No projects yet. Add your first one.</p>
                ) : (
                    <div className="grid gap-4">
                        {projects.map((project) => (
                            <Card key={project.id}>
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base">{project.title}</CardTitle>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">{project.category}</Badge>
                                            {project.is_featured && (
                                                <Badge variant="default">Featured</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/dashboard/projects/${project.id}/edit`}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(project.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {project.tech_stack.map((tech) => (
                                            <Badge key={tech} variant="outline" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
