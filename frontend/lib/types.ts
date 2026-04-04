// Project type — matches the database schema exactly
export interface Project {
    id: number;
    title: string;
    description: string;
    category: 'frontend' | 'backend' | 'fullstack';
    tech_stack: string[];
    image_url: string | null;
    github_url: string | null;
    deploy_url: string | null;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

// API response wrapper — Laravel returns { data: ... }
export interface ApiResponse<T> {
    data: T;
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

// Filter params for the projects list
export interface ProjectFilters {
    category?: 'frontend' | 'backend' | 'fullstack' | 'all';
    sort?: 'latest' | 'oldest';
    featured?: boolean;
}
