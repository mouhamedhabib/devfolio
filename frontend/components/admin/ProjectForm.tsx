'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Project } from '@/lib/types';

interface ProjectFormProps {
    project?: Project;
    token: string;
    onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProjectForm({ project, token, onSubmit }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [techStack, setTechStack] = useState<string[]>(project?.tech_stack ?? []);
    const [techInput, setTechInput] = useState('');

    function addTech(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = techInput.trim();
            if (value && !techStack.includes(value)) {
                setTechStack([...techStack, value]);
            }
            setTechInput('');
        }
    }

    function removeTech(tech: string) {
        setTechStack(techStack.filter(t => t !== tech));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (techStack.length === 0) {
            toast.error('Add at least one technology');
            return;
        }

        setLoading(true);
        const form = new FormData(e.currentTarget);
        form.delete('tech_input');
        techStack.forEach(tech => form.append('tech_stack[]', tech));

        try {
            await onSubmit(form);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={project?.title} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={project?.description} rows={4} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                    id="category"
                    name="category"
                    defaultValue={project?.category ?? 'fullstack'}
                    className="w-full border rounded-md px-3 py-2 bg-background text-sm"
                    required
                >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="fullstack">Full Stack</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="tech_input">Tech Stack</Label>
                <Input
                    id="tech_input"
                    name="tech_input"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={addTech}
                    placeholder="Type a technology and press Enter"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {techStack.map(tech => (
                        <Badge
                            key={tech}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeTech(tech)}
                        >
                            {tech} ✕
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Project Image</Label>
                {project?.image_url && (
                    <img src={project.image_url} alt="Current" className="w-32 h-20 object-cover rounded mb-2" />
                )}
                <Input id="image" name="image" type="file" accept="image/*" />
            </div>

            {/* External links — all optional */}
            <div className="space-y-4 border rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground">
                    Links — all optional. Shown as action buttons on the project card.
                </p>

                <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                        id="github_url"
                        name="github_url"
                        type="url"
                        defaultValue={project?.github_url ?? ''}
                        placeholder="https://github.com/user/repo"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="deploy_url">Deploy URL</Label>
                    <Input
                        id="deploy_url"
                        name="deploy_url"
                        type="url"
                        defaultValue={project?.deploy_url ?? ''}
                        placeholder="https://myproject.vercel.app"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="blog_url">Blog / Article URL</Label>
                    <Input
                        id="blog_url"
                        name="blog_url"
                        type="url"
                        defaultValue={project?.blog_url ?? ''}
                        placeholder="https://dev.to/user/my-project"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    id="is_featured"
                    name="is_featured"
                    type="checkbox"
                    defaultChecked={project?.is_featured ?? false}
                    className="w-4 h-4"
                />
                <Label htmlFor="is_featured">Featured on homepage</Label>
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
