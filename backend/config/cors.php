<?php

return [
    // Apply CORS only to API routes
    'paths' => ['api/*'],

    // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    'allowed_methods' => ['*'],

    // In production: replace * with your real frontend domain
    // Example: 'https://yourportfolio.com'
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    // Allow all headers — including Authorization for Sanctum token
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    // Cache preflight request for 1 hour (reduces OPTIONS requests)
    'max_age' => 3600,

    // Do not share cookies across origins (we use tokens not sessions)
    'supports_credentials' => false,
];
