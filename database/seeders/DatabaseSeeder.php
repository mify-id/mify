<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Brief;
use App\Models\AuditLog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin MiFy',
            'email' => 'admin@mify.id',
            'password' => bcrypt('password'),
        ]);

        Brief::create([
            'name' => 'Hendra Wijaya',
            'email' => 'hendra@nusantara.co.id',
            'company' => 'Nusantara Retail',
            'budget' => 'IDR 350M',
            'message' => 'We want to scale our retail synchronization backend with Laravel, using SQLite replicas for local cache. Need high reliability and real-time inventory updates.',
            'tech_stack' => ['Laravel', 'SQLite', 'Tailwind', 'REST API'],
            'status' => 'pending',
            'created_at' => now()->subHours(2),
        ]);

        Brief::create([
            'name' => 'Nadia Utami',
            'email' => 'nadia@sinergilogistics.com',
            'company' => 'Sinergi Logistics',
            'budget' => 'IDR 850M',
            'message' => 'Looking to build a real-time fleet delivery tracker using React and custom mapping APIs. Need a web panel and integration with Inertia.',
            'tech_stack' => ['React', 'Vite', 'Inertia', 'Tailwind', 'PHP'],
            'status' => 'discussion',
            'created_at' => now()->subHours(5),
        ]);

        Brief::create([
            'name' => 'Rian Pramana',
            'email' => 'rian@astrafintech.id',
            'company' => 'Astra FinTech',
            'budget' => 'IDR 1.2B',
            'message' => 'High-security API layer development for our microservice architecture. Requires extensive security logging and Laravel backend engineering.',
            'tech_stack' => ['Laravel', 'REST API', 'SQLite', 'Security'],
            'status' => 'approved',
            'created_at' => now()->subDays(1),
        ]);

        \App\Models\Pipeline::create([
            'project_name' => 'Logistics Tracking Portal',
            'client_name' => 'Nadia Utami',
            'client_email' => 'nadia@sinergilogistics.com',
            'tech_stack' => ['React', 'Vite', 'Inertia', 'Tailwind', 'PHP'],
            'budget' => 'IDR 850M',
            'phase' => 'discovery',
            'health' => 'nominal',
            'repo_commit' => 'e7b9d31',
            'system_architecture' => [
                'frontend' => 'React 19, Tailwind CSS v4, Inertia.js client',
                'backend' => 'Laravel 13 Monolith (PHP 8.3)',
                'database' => 'PostgreSQL with connection pooling',
                'hosting' => 'Fly.io (Distributed VPS) + Vercel (Frontend Edge)',
            ],
            'deadline' => now()->addMonths(2)->toDateString(),
        ]);

        \App\Models\Pipeline::create([
            'project_name' => 'Secure API Gateways',
            'client_name' => 'Rian Pramana',
            'client_email' => 'rian@astrafintech.id',
            'tech_stack' => ['Laravel', 'REST API', 'SQLite', 'Security'],
            'budget' => 'IDR 1.2B',
            'phase' => 'core_features',
            'health' => 'warning',
            'repo_commit' => 'ab8c19f',
            'system_architecture' => [
                'frontend' => 'Strict CSP Admin Portal',
                'backend' => 'Laravel 13 (Octane runtime) + Laravel Sanctum',
                'database' => 'PostgreSQL (RDS Multi-AZ)',
                'hosting' => 'AWS ECS Fargate, Cloudflare Enterprise Edge',
            ],
            'deadline' => now()->addMonth()->toDateString(),
        ]);

        AuditLog::create([
            'event' => 'Database migration fresh & seed',
            'ip' => 'Console CLI',
            'created_at' => now()->subMinutes(15),
        ]);

        AuditLog::create([
            'event' => 'Admin mify session started',
            'ip' => '127.0.0.1',
            'created_at' => now()->subMinutes(10),
        ]);

        AuditLog::create([
            'event' => 'Routing cache synchronized',
            'ip' => 'Internal Engine',
            'created_at' => now()->subMinutes(5),
        ]);

        $this->call(PosSeeder::class);
    }
}
