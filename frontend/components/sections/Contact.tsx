'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        gsap.fromTo(
            sectionRef.current,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
            }
        );
    }, []);

    return (
        <section ref={sectionRef} id="contact" className="py-20 px-6">
            <div className="max-w-xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-bold">Get In Touch</h2>
                <p className="text-muted-foreground">
                    Have a project in mind or want to work together?
                    My inbox is always open.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <a href="mailto:your@email.com">
                        <Button size="lg">Say Hello</Button>
                    </a>
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" variant="outline">GitHub</Button>
                    </a>
                </div>
            </div>
        </section>
    );
}
