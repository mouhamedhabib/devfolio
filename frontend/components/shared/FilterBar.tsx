'use client';

import { ProjectFilters } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
    filters: ProjectFilters;
    onChange: (filters: ProjectFilters) => void;
}

const categories = [
    { label: 'All',       value: 'all'       },
    { label: 'Frontend',  value: 'frontend'  },
    { label: 'Backend',   value: 'backend'   },
    { label: 'Full Stack', value: 'fullstack' },
] as const;

const sorts = [
    { label: 'Latest', value: 'latest' },
    { label: 'Oldest', value: 'oldest' },
] as const;

export default function FilterBar({ filters, onChange }: FilterBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">

            {/* Category filter */}
            <div className="flex gap-2">
                {categories.map(cat => (
                    <Button
                        key={cat.value}
                        size="sm"
                        // Active category gets filled style, others get outline
                        variant={filters.category === cat.value ? 'default' : 'outline'}
                        onClick={() => onChange({ ...filters, category: cat.value })}
                    >
                        {cat.label}
                    </Button>
                ))}
            </div>

            {/* Sort filter */}
            <div className="flex gap-2 ml-auto">
                {sorts.map(sort => (
                    <Button
                        key={sort.value}
                        size="sm"
                        variant={filters.sort === sort.value ? 'default' : 'outline'}
                        onClick={() => onChange({ ...filters, sort: sort.value })}
                    >
                        {sort.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
