<?php

namespace App\Http\Controllers;

use App\Models\Brief;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class BriefController extends Controller
{
    /**
     * Display a listing of client briefs.
     */
    public function index()
    {
        return \Inertia\Inertia::render('Briefs/Index', [
            'briefs' => Brief::latest()->get(),
        ]);
    }

    /**
     * Update internal notes and priority for a brief.
     */
    public function updateNotesPriority(Request $request, Brief $brief)
    {
        $validated = $request->validate([
            'priority' => 'required|string|in:low,medium,high',
            'notes' => 'nullable|string',
        ]);

        $brief->update($validated);

        AuditLog::create([
            'event' => "Brief for {$brief->company} updated (priority: {$brief->priority})",
            'ip' => $request->ip() ?? '127.0.0.1',
        ]);

        return redirect()->back()->with('success', 'Notes and priority updated successfully.');
    }

    /**
     * Store a new brief from the landing page.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // Auto-generate realistic metadata to show on the admin dashboard
        // Parse company name from email domain
        $domain = substr(strrchr($validated['email'], "@"), 1);
        $company = null;
        if ($domain && !in_array($domain, ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'])) {
            $parts = explode('.', $domain);
            $company = ucwords($parts[0] ?? 'Agency');
        } else {
            $company = 'Freelance / Personal';
        }

        // Random budget generator
        $budgets = ['IDR 150M', 'IDR 300M', 'IDR 500M', 'IDR 750M', 'IDR 1.2B'];
        $budget = $budgets[array_rand($budgets)];

        // Simple keyword-based tech stack generator
        $techKeywords = [
            'laravel' => 'Laravel',
            'react' => 'React',
            'vue' => 'Vue',
            'tailwind' => 'Tailwind',
            'sqlite' => 'SQLite',
            'postgres' => 'PostgreSQL',
            'mysql' => 'MySQL',
            'next' => 'Next.js',
            'vite' => 'Vite',
            'inertia' => 'Inertia',
            'api' => 'REST API',
            'security' => 'Security',
            'docker' => 'Docker',
            'node' => 'Node.js',
        ];

        $stack = [];
        $lowerMessage = strtolower($validated['message']);
        $lowerName = strtolower($validated['name']);
        
        foreach ($techKeywords as $key => $value) {
            if (str_contains($lowerMessage, $key) || str_contains($lowerName, $key)) {
                $stack[] = $value;
            }
        }

        // Ensure we always have some stacks if no keywords match
        if (empty($stack)) {
            $stack = ['Laravel', 'React', 'Tailwind'];
        }

        $brief = Brief::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $company,
            'budget' => $budget,
            'message' => $validated['message'],
            'tech_stack' => $stack,
            'status' => 'pending',
        ]);

        AuditLog::create([
            'event' => "Brief received: {$brief->company} ({$brief->budget})",
            'ip' => $request->ip() ?? '127.0.0.1',
        ]);

        return redirect()->back()->with('success', 'Brief submitted successfully!');
    }

    /**
     * Update the status of a brief from the admin dashboard.
     */
    public function updateStatus(Request $request, Brief $brief)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,discussion,approved',
        ]);

        $brief->update([
            'status' => $validated['status'],
        ]);

        AuditLog::create([
            'event' => "Brief status updated to '{$brief->status}' for {$brief->company}",
            'ip' => $request->ip() ?? '127.0.0.1',
        ]);

        return redirect()->back();
    }

    /**
     * Delete a brief from the admin dashboard.
     */
    public function destroy(Request $request, Brief $brief)
    {
        $companyName = $brief->company ?? 'Personal Project';
        $brief->delete();

        AuditLog::create([
            'event' => "Brief deleted: {$companyName}",
            'ip' => $request->ip() ?? '127.0.0.1',
        ]);

        return redirect()->back();
    }

    /**
     * Generate an AI Blueprint for the given brief.
     */
    public function generateBlueprint(Request $request, Brief $brief)
    {
        $validated = $request->validate([
            'focus' => 'nullable|string|in:speed,security,budget',
        ]);

        $focus = $validated['focus'] ?? 'speed';
        $greetingName = explode(' ', trim($brief->name))[0];

        // 1. Nvidia Step-3.7-Flash Integration Configs
        $apiKey = env('NVIDIA_API_KEY');
        $apiUrl = env('NVIDIA_API_URL', 'https://integrate.api.nvidia.com/v1/chat/completions');
        $model = env('NVIDIA_MODEL', 'stepfun-ai/step-3.7-flash');

        $blueprintData = null;
        $usedAi = false;

        $prompt = "You are mify.id's AI System Architect Engine.
Analyze the following client brief and generate a comprehensive digital system blueprint.

CLIENT NAME: {$brief->name}
EMAIL: {$brief->email}
COMPANY: {$brief->company}
BUDGET: {$brief->budget}
MESSAGE / REQUIREMENTS:
\"{$brief->message}\"

FOCUS PRIORITY: {$focus} (speed, security, or budget)

You MUST respond with a single valid JSON object containing exactly these keys:
{
  \"system_type\": \"[A premium specific system classification name]\",
  \"description\": \"[A punchy one-sentence technical summary of the system]\",
  \"architecture\": {
    \"frontend\": \"[Specific frontend tech list based on focus: {$focus}]\",
    \"backend\": \"[Specific backend engine list based on focus: {$focus}]\",
    \"database\": \"[Specific database & caching system based on focus: {$focus}]\",
    \"hosting\": \"[Specific cloud hosting suggestion based on focus: {$focus}]\",
    \"security_policy\": \"[Security statement based on focus: {$focus}]\"
  },
  \"timeline\": [
    {
      \"phase\": \"Phase 1: [Phase name]\",
      \"duration\": \"[Weeks/Days]\",
      \"tasks\": [\"Task 1\", \"Task 2\", \"Task 3\"]
    },
    ...
  ],
  \"risks\": [
    {
      \"title\": \"[Potential technical bottleneck or risk]\",
      \"severity\": \"[High/Medium/Low]\",
      \"mitigation\": \"[Specific technical mitigation strategy]\"
    },
    ...
  ],
  \"pitch\": \"[A professional, personalized email pitch to the client starting with 'Hi {$greetingName},' outlining our proposed arhcitecture and requesting a discovery call. Use markdown formatting.]\"
}

IMPORTANT:
1. Tech stacks must match the focus: {$focus}.
2. Do NOT add any extra text, conversational introduction, or trailing comments. Return ONLY the raw JSON object.";

        if (!empty($apiKey)) {
            try {
                $response = Http::withoutVerifying()->withHeaders([
                    'Authorization' => "Bearer {$apiKey}",
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])->timeout(30)->post($apiUrl, [
                    'model' => $model,
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => $prompt
                        ]
                    ],
                    'temperature' => 0.7,
                    'top_p' => 1,
                    'max_tokens' => 4096,
                    'seed' => 42,
                    'stream' => false
                ]);

                if ($response->successful()) {
                    $rawBody = $response->json('choices.0.message.content');
                    if ($rawBody) {
                        $jsonString = $rawBody;
                        // Clean markdown formatting if wrapped in code blocks
                        if (preg_match('/^```(?:json)?\s*(.*?)\s*```$/s', trim($jsonString), $matches)) {
                            $jsonString = $matches[1];
                        }
                        $decoded = json_decode(trim($jsonString), true);
                        if (is_array($decoded) && isset($decoded['system_type'], $decoded['architecture'], $decoded['timeline'], $decoded['risks'], $decoded['pitch'])) {
                            $blueprintData = $decoded;
                            $usedAi = true;
                        }
                    }
                }
            } catch (\Exception $e) {
                // Fail silently, fallback will be used
            }
        }

        if ($blueprintData) {
            $brief->update([
                'ai_blueprint' => array_merge([
                    'generated_at' => now()->toIso8601String(),
                    'focus' => $focus,
                ], $blueprintData)
            ]);

            AuditLog::create([
                'event' => "AI Blueprint generated via NVIDIA GLM-5.2 for {$brief->company} ({$focus} focus)",
                'ip' => $request->ip() ?? '127.0.0.1',
            ]);
        } else {
            // ==========================================
            // LOCAL DETERMINISTIC FALLBACK CORE
            // ==========================================
            $message = strtolower($brief->message);
            $systemType = 'Custom Enterprise SaaS';
            $desc = 'High-performance cloud-native software suite';
            
            if (str_contains($message, 'shop') || str_contains($message, 'commerce') || str_contains($message, 'store') || str_contains($message, 'payment') || str_contains($message, 'cart')) {
                $systemType = 'Headless E-Commerce System';
                $desc = 'Distributed storefront with global payment routing and inventory synchronizer';
            } elseif (str_contains($message, 'gym') || str_contains($message, 'member') || str_contains($message, 'fit') || str_contains($message, 'book') || str_contains($message, 'schedul')) {
                $systemType = 'Biometric Membership & Booking Platform';
                $desc = 'Real-time booking orchestrator with hardware integration hooks and automated renewals';
            } elseif (str_contains($message, 'social') || str_contains($message, 'chat') || str_contains($message, 'commun') || str_contains($message, 'messag')) {
                $systemType = 'Real-Time Communication Hub';
                $desc = 'WebSocket-powered network with end-to-end encryption and media optimization pipeline';
            } elseif (str_contains($message, 'school') || str_contains($message, 'learn') || str_contains($message, 'cours') || str_contains($message, 'student')) {
                $systemType = 'Adaptive Learning Management System';
                $desc = 'Educational portal with dynamic progress trackers and grading engines';
            }

            $frontend = 'React 19, Vite 8, Tailwind CSS v4, Framer Motion';
            $backend = 'Laravel 13 Monolith (PHP 8.3)';
            $database = 'PostgreSQL with connection pooling, Redis for caching';
            $hosting = 'Fly.io (Distributed VPS) + Vercel (Frontend Edge)';
            
            if ($focus === 'security') {
                $frontend = 'Next.js 15 (App Router), Strict Content Security Policies, React Hook Form + Zod';
                $backend = 'Laravel 13 (Octane runtime) + Laravel Sanctum (Stateful Tokens)';
                $database = 'PostgreSQL (RDS Multi-AZ), Redis Cluster (Encrypted Transit)';
                $hosting = 'AWS ECS Fargate (Private Subnet), Cloudflare Enterprise Edge';
            } elseif ($focus === 'budget') {
                $frontend = 'React 19, Tailwind CSS v4, Inertia.js client';
                $backend = 'Laravel 13 Monolith (Spatie optimized)';
                $database = 'PostgreSQL (Single Instance, 10GB SSD)';
                $hosting = 'DigitalOcean App Platform (All-in-one container)';
            }

            $pitch = "Hi {$greetingName},\n\n";
            $pitch .= "Thank you for sharing your project brief for " . ($brief->company ?? 'your project') . ". ";
            $pitch .= "We have thoroughly analyzed your requirements and architected a **{$systemType}** tailored specifically to your needs.\n\n";
            $pitch .= "### Proposed Solution Overview\n";
            $pitch .= "*   **System Classification:** {$systemType} ({$desc})\n";
            $pitch .= "*   **Core Stack:** {$frontend} on the frontend, powered by {$backend} backend, running on {$database}.\n";
            $pitch .= "*   **Deployment Strategy:** {$hosting} for high availability and sub-100ms response times.\n\n";
            
            if ($focus === 'security') {
                $pitch .= "### Enterprise-Grade Security Features\n";
                $pitch .= "*   Stateful token authentication via Laravel Sanctum.\n";
                $pitch .= "*   Complete end-to-end sanitization of all incoming requests to mitigate SQL Injection, XSS, and CSRF.\n";
                $pitch .= "*   Automated audit trail logging for critical administrative events.\n\n";
            } elseif ($focus === 'budget') {
                $pitch .= "### Cost-Optimization Focus\n";
                $pitch .= "*   Monolithic architecture reduces deployment overhead and keeps server costs under \$40/month.\n";
                $pitch .= "*   Simplified asset pipelines utilizing Vite 8 bundling.\n\n";
            } else {
                $pitch .= "### High-Performance Focus\n";
                $pitch .= "*   Edge rendering for frontend pages via Vercel CDN.\n";
                $pitch .= "*   WebSocket orchestration for instantaneous state synchronization.\n\n";
            }
            
            $pitch .= "We would love to jump on a quick discovery call to walk you through this architecture and discuss the implementation timeline. Let us know what time works best for you next week!\n\n";
            $pitch .= "Best regards,\n";
            $pitch .= "The mify.id Architecture Team";

            $timeline = [
                [
                    'phase' => 'Phase 1: Discovery & Wireframing',
                    'duration' => 'Week 1-2',
                    'tasks' => ['Requirement alignment & architecture review', 'Interactive high-fidelity UI/UX prototyping', 'Database schema modeling & normalization design']
                ],
                [
                    'phase' => 'Phase 2: Database & Core API Setup',
                    'duration' => 'Week 3-4',
                    'tasks' => ['Database indexing & security policies setup', 'Core REST/GraphQL API controllers development', 'Authentication & authorization logic implementation']
                ],
                [
                    'phase' => 'Phase 3: Core Features & Integration',
                    'duration' => 'Week 5-7',
                    'tasks' => ['Primary business workflow coding', 'Third-party API integrations (Payment gateways, SMTP)', 'WebSocket notification triggers & event handlers']
                ],
                [
                    'phase' => 'Phase 4: QA, Audit & Deployment',
                    'duration' => 'Week 8',
                    'tasks' => ['End-to-end integration testing', 'Automated security vulnerability scan & compliance audit', 'Production build compilation & multi-region deployment']
                ]
            ];

            $risks = [
                [
                    'title' => 'Third-Party Integration Downtime',
                    'severity' => 'Medium',
                    'mitigation' => 'Implement circuit breakers & queued job retries for external REST APIs'
                ],
                [
                    'title' => 'Scaling during Peak Spikes',
                    'severity' => 'High',
                    'mitigation' => 'Deploy containerized autoscaling groups on Fly.io / AWS ECS and offload read-traffic to Redis'
                ]
            ];

            if ($focus === 'security') {
                $risks[] = [
                    'title' => 'Credential Hijacking',
                    'severity' => 'High',
                    'mitigation' => 'Enforce HTTP-only cookies, stateful session verification, and IP-whitelist checks on Admin console'
                ];
            }

            $brief->update([
                'ai_blueprint' => [
                    'generated_at' => now()->toIso8601String(),
                    'focus' => $focus,
                    'system_type' => $systemType,
                    'description' => $desc,
                    'architecture' => [
                        'frontend' => $frontend,
                        'backend' => $backend,
                        'database' => $database,
                        'hosting' => $hosting,
                        'security_policy' => $focus === 'security' ? 'Strict Isolation' : 'Standard Protection',
                    ],
                    'timeline' => $timeline,
                    'risks' => $risks,
                    'pitch' => $pitch,
                ]
            ]);

            AuditLog::create([
                'event' => "AI Blueprint (Deterministic Fallback) generated for {$brief->company} ({$focus} focus)",
                'ip' => $request->ip() ?? '127.0.0.1',
            ]);
        }

        return redirect()->back();
    }
}

