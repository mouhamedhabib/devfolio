'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subRef     = useRef<HTMLParagraphElement>(null);
    const ctaRef     = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Staggered entrance animation — each element animates after the previous
        // timeline keeps animations in sequence without nesting callbacks
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(headingRef.current,
            { y: 40, opacity: 0 },
            { y: 0,  opacity: 1, duration: 0.9 }
        )
        .fromTo(subRef.current,
            { y: 30, opacity: 0 },
            { y: 0,  opacity: 1, duration: 0.7 },
            '-=0.5' // start 0.5s before previous animation ends (overlap)
        )
        .fromTo(ctaRef.current,
            { y: 20, opacity: 0 },
            { y: 0,  opacity: 1, duration: 0.6 },
            '-=0.4'
        );
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center px-6 pt-16">
            <div className="max-w-3xl mx-auto text-center space-y-8">

                <h1
                    ref={headingRef}
                    className="text-5xl md:text-7xl font-bold tracking-tight"
                >
                    Hi, I&apos;m{' '}
                    <span className="text-primary">med habib </span>
                    <br />
                    Full-Stack Developer
                </h1>

                <p
                    ref={subRef}
                    className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
                >
                    I build fast, clean, production-ready web applications.
                    Laravel on the backend. Next.js on the front.
                </p>

                <div ref={ctaRef} className="flex items-center justify-center gap-4">
                    <Link href="/projects">
                        <Button size="lg">
                            View Projects
                        </Button>
                    </Link>
                    <Link href="#contact">
                        <Button size="lg" variant="outline">
                            Contact Me
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
