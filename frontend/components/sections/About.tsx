'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef    = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animate section content when it scrolls into view
        gsap.fromTo(
            textRef.current,
            { x: -40, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                },
            }
        );
    }, []);

    const skills = [
        'Laravel', 'PHP', 'PostgreSQL', 'Docker',
        'Next.js', 'TypeScript', 'Tailwind CSS', 'REST API',
    ];

    return (
        <section ref={sectionRef} id="about" className="py-20 px-6 bg-muted/30">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                <div ref={textRef} className="space-y-6">
                    <h2 className="text-3xl font-bold">About Me</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Full-stack developer focused on building clean, fast, and
                        maintainable web applications. I care about architecture,
                        code quality, and shipping things that actually work in production.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Currently available for freelance work and full-time positions.
                    </p>
                </div>

                {/* Skills grid */}
                <div className="grid grid-cols-2 gap-3">
                    {skills.map((skill) => (
                        <div
                            key={skill}
                            className="border rounded-lg px-4 py-3 text-sm font-medium text-center hover:border-primary transition-colors"
                        >
                            {skill}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
