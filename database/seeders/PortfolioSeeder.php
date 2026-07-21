<?php

namespace Database\Seeders;

use App\Models\Portfolio;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $portfolios = [
            [
                'title' => 'OmniChannel Retail POS & Inventory Engine',
                'slug' => 'omnichannel-retail-pos',
                'category' => 'POS Cashier',
                'description' => 'Real-time retail point of sale system with pessimistic inventory locking, instant barcode scanning, and SQLite ACID transaction safety.',
                'image_path' => 'https://images.unsplash.com/photo-1556742049-0a6754099a6b?auto=format&fit=crop&w=1200&q=80',
                'project_url' => 'https://mify.id/dashboard/pos',
                'tech_stack' => ['Laravel 13', 'React 19', 'Inertia.js', 'Tailwind CSS'],
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'title' => 'Enterprise AI Brief Architect & Engine',
                'slug' => 'enterprise-ai-brief-architect',
                'category' => 'AI Automation',
                'description' => 'Autonomous LLM system proposal generator converting raw client specifications into structured technical blueprints with zero latency.',
                'image_path' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                'project_url' => 'https://mify.id',
                'tech_stack' => ['NVIDIA LLM', 'Laravel API', 'Inertia', 'Phar Icons'],
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'title' => 'High-Velocity SaaS Subscription & Billing Portal',
                'slug' => 'saas-subscription-billing-portal',
                'category' => 'Web System',
                'description' => 'Monolithic SaaS platform with compiled brand tokens, dark mode aesthetics, and zero client-side routing latency.',
                'image_path' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                'project_url' => 'https://mify.id',
                'tech_stack' => ['Laravel 13', 'React 19', 'Vite', 'Tailwind CSS v4'],
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'title' => 'Data-Driven Growth & Marketing Analytics Hub',
                'slug' => 'data-driven-marketing-analytics-hub',
                'category' => 'Marketing System',
                'description' => 'Real-time performance tracking dashboard with interactive metrics cards, conversion monitoring, and automated lead capture.',
                'image_path' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                'project_url' => 'https://mify.id',
                'tech_stack' => ['React 19', 'Framer Motion', 'Chart.js', 'Laravel'],
                'is_featured' => true,
                'order' => 4,
            ],
        ];

        foreach ($portfolios as $data) {
            Portfolio::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}
