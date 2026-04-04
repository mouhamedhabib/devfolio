'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from '@/components/shared/ProjectCard';
import FilterBar from '@/components/shared/FilterBar';
import { Project, ProjectFilters, ApiResponse } from '@/lib/types';

// Register ScrollTrigger plugin — must be done before using it
gsap.registerPlugin(ScrollTrigger);

interface ProjectsGridProps {
    // Initial projects fetched server-side — passed as props
    initialProjects: Project[];
}

export default function ProjectsGrid({ initialProjects }: ProjectsGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<ProjectFilters>({
        category: 'all',
        sort: 'latest',
    });

    // Animate cards when they enter the viewport using ScrollTrigger
    useEffect(() => {
        if (!gridRef.current) return;

        const cards = gridRef.current.querySelectorAll('.project-card');

        // staggerFrom animates each card with a delay between them
        gsap.fromTo(
            cards,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1, // 100ms delay between each card
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: 'top 80%', // animate when grid is 80% from top of viewport
                },
            }
        );
    }, [projects]);

    // Fetch filtered projects from API when filters change
    async function handleFilterChange(newFilters: ProjectFilters) {
        setFilters(newFilters);
        setLoading(true);

        // Build query string from filter object — only include non-empty values
        const params = new URLSearchParams();
        if (newFilters.category && newFilters.category !== 'all') {
            params.set('category', newFilters.category);
        }
        if (newFilters.sort) params.set('sort', newFilters.sort);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects?${params.toString()}`,
                { cache: 'no-store' } // always fetch fresh data when filter changes
            );
            const data: ApiResponse<Project[]> = await res.json();
            setProjects(data.data);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Projects</h2>
                    <p className="text-muted-foreground">Things I&apos;ve built</p>
                </div>

                <FilterBar filters={filters} onChange={handleFilterChange} />

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            // Skeleton loader while fetching
                            <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-20">
                        No projects found.
                    </p>
                ) : (
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {projects.map(project => (
                            // project-card class is used by GSAP selector above
                            <div key={project.id} className="project-card">
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
