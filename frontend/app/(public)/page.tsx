import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/sections/Hero';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import { ApiResponse, Project } from '@/lib/types';

// Server Component — fetch featured projects at build/request time
// This gives us SSR + SEO for free without useEffect
async function getFeaturedProjects(): Promise<Project[]> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/projects?featured=true&sort=latest`,
            // Revalidate every 60 seconds — ISR (Incremental Static Regeneration)
            { next: { revalidate: 60 } }
        );

        if (!res.ok) return [];

        const data: ApiResponse<Project[]> = await res.json();
        return data.data;
    } catch {
        // Return empty array on error — page still renders without projects
        return [];
    }
}

export default async function HomePage() {
    const projects = await getFeaturedProjects();

    return (
        <main>
            <Navbar />
            <Hero />
            <ProjectsGrid initialProjects={projects} />
            <About />
            <Contact />
        </main>
    );
}
