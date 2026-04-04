'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Animate navbar sliding down on page load
        // fromTo: start state → end state
        gsap.fromTo(
            navRef.current,
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
    }, []);

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm"
        >
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="font-bold text-lg tracking-tight">
                    devfolio<span className="text-primary">.</span>
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-6 text-sm">
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/projects"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Projects
                    </Link>
                    <Link
                        href="#contact"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
}
