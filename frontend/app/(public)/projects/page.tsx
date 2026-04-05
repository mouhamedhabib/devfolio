import Navbar from '@/components/shared/Navbar';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import { ApiResponse, Project } from '@/lib/types';

// Server Component — fetch all projects server-side for SEO
async function getAllProjects(): Promise<Project[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL}/projects?sort=latest`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) return [];

        const data: ApiResponse<Project[]> = await res.json();
        return data.data;
    } catch {
        return [];
    }
}

export const metadata = {
    title: 'Projects — DevFolio',
    description: 'All projects built by the developer',
};

export default async function ProjectsPage() {
    const projects = await getAllProjects();

    return (
        <main>
            <Navbar />
            <div className="pt-16">
                <ProjectsGrid initialProjects={projects} />
            </div>
        </main>
    );
}
