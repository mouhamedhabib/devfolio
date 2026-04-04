'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/types';

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Animate card on mouse enter — subtle scale + shadow
    function onMouseEnter() {
        gsap.to(cardRef.current, {
            y: -4,
            duration: 0.2,
            ease: 'power2.out',
        });
    }

    // Reset on mouse leave
    function onMouseLeave() {
        gsap.to(cardRef.current, {
            y: 0,
            duration: 0.2,
            ease: 'power2.out',
        });
    }

    // Determine which action buttons to show based on available links
    // A project might have only GitHub, only deploy, only a blog post, or any combo
    const links = [
        project.github_url && { label: 'GitHub', href: project.github_url },
        project.deploy_url && { label: 'Live', href: project.deploy_url },
        project.blog_url && { label: 'Article', href: project.blog_url },
    ].filter(Boolean) as { label: string; href: string }[];

    return (
        <div ref={cardRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <Card className="h-full overflow-hidden">

                {/* Project image */}
                {project.image_url && (
                    <div className="w-full h-48 overflow-hidden">
                        <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                )}

                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-snug">
                            {project.title}
                        </CardTitle>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                            {project.category}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.description}
                    </p>

                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-1">
                        {project.tech_stack.map(tech => (
                            <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                            </Badge>
                        ))}
                    </div>

                    {/* Action buttons — only shown if links exist */}
                    {links.length > 0 && (
                        <div className="flex gap-2 pt-1">
                            {links.map(link => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="sm">
                                        {link.label}
                                    </Button>
                                </a>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
