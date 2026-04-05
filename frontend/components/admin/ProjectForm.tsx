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

// Two modes for image input: upload a file or paste a URL
type ImageMode = 'upload' | 'url';

export default function ProjectForm({ project, token, onSubmit }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [techStack, setTechStack] = useState<string[]>(project?.tech_stack ?? []);
    const [techInput, setTechInput] = useState('');
    // Default to URL mode if project already has an image_url
    const [imageMode, setImageMode] = useState<ImageMode>(
        project?.image_url ? 'url' : 'upload'
    );
    const [imageUrl, setImageUrl] = useState(project?.image_url ?? '');

    function addTech(value: string) {
        const trimmed = value.trim().replace(/,$/, '');
        if (trimmed && !techStack.includes(trimmed)) {
            setTechStack(prev => [...prev, trimmed]);
        }
        setTechInput('');
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTech(techInput);
        }
    }

    function onBlur() {
        if (techInput.trim()) addTech(techInput);
    }

    function removeTech(tech: string) {
        setTechStack(techStack.filter(t => t !== tech));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const remainingInput = techInput.trim().replace(/,$/, '');
        const finalStack = remainingInput && !techStack.includes(remainingInput)
            ? [...techStack, remainingInput]
            : techStack;

        if (finalStack.length === 0) {
            toast.error('Add at least one technology');
            return;
        }

        setLoading(true);
        const form = new FormData(e.currentTarget);
        form.delete('tech_input');
        form.delete('image_url_input');
        form.delete('image');

        finalStack.forEach(tech => form.append('tech_stack[]', tech));

        // Add image based on selected mode
        if (imageMode === 'url' && imageUrl.trim()) {
            // Pass URL directly — backend stores it without Cloudinary
            form.append('image_url', imageUrl.trim());
        } else if (imageMode === 'upload') {
            // Pass file — backend uploads to Cloudinary
            const fileInput = (e.currentTarget as HTMLFormElement)
                .querySelector<HTMLInputElement>('#image');
            if (fileInput?.files?.[0]) {
                form.append('image', fileInput.files[0]);
            }
        }

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
                <Label htmlFor="tech_input">
                    Tech Stack
                    <span className="text-muted-foreground text-xs ml-2">
                        Press Enter or comma to add
                    </span>
                </Label>
                <Input
                    id="tech_input"
                    name="tech_input"
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                    placeholder="e.g. React, Laravel, Docker..."
                />
                {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {techStack.map(tech => (
                            <Badge
                                key={tech}
                                variant="secondary"
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeTech(tech)}
                            >
                                {tech} ✕
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Image — toggle between upload and URL */}
            <div className="space-y-3">
                <Label>Project Image</Label>

                {/* Mode toggle */}
                <div className="flex gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant={imageMode === 'upload' ? 'default' : 'outline'}
                        onClick={() => setImageMode('upload')}
                    >
                        Upload File
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={imageMode === 'url' ? 'default' : 'outline'}
                        onClick={() => setImageMode('url')}
                    >
                        Paste URL
                    </Button>
                </div>

                {imageMode === 'upload' ? (
                    <Input id="image" name="image" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/gif" />
                ) : (
                    <Input
                        id="image_url_input"
                        name="image_url_input"
                        type="url"
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.png"
                    />
                )}

                {/* Preview current image */}
                {(imageUrl || project?.image_url) && imageMode === 'url' && (
                    <img
                        src={imageUrl || project?.image_url || ''}
                        alt="Preview"
                        className="w-40 h-24 object-cover rounded border"
                    />
                )}
            </div>

            <div className="space-y-4 border rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground">Links — all optional</p>
                <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input id="github_url" name="github_url" type="url" defaultValue={project?.github_url ?? ''} placeholder="https://github.com/user/repo" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deploy_url">Deploy URL</Label>
                    <Input id="deploy_url" name="deploy_url" type="url" defaultValue={project?.deploy_url ?? ''} placeholder="https://myproject.vercel.app" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="blog_url">Blog / Article URL</Label>
                    <Input id="blog_url" name="blog_url" type="url" defaultValue={project?.blog_url ?? ''} placeholder="https://dev.to/user/my-project" />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input id="is_featured" name="is_featured" type="checkbox" defaultChecked={project?.is_featured ?? false} className="w-4 h-4" />
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
