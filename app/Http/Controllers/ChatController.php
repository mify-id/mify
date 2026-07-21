<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function handle(Request $request)
    {
        $validated = $request->validate([
            'messages' => 'required|array',
            'messages.*.sender' => 'required|string|in:user,bot',
            'messages.*.text' => 'required|string',
        ]);

        $apiKey = env('NVIDIA_API_KEY');
        $apiUrl = env('NVIDIA_API_URL', 'https://integrate.api.nvidia.com/v1/chat/completions');
        $model = env('NVIDIA_MODEL', 'stepfun-ai/step-3.7-flash');

        if (empty($apiKey)) {
            return response()->json([
                'reply' => 'System error: NVIDIA AI Model key is missing. Please set NVIDIA_API_KEY in the .env file.'
            ], 500);
        }

        // Format history for OpenAI compatible API
        $formattedMessages = [
            [
                'role' => 'system',
                'content' => "You are mify's public AI assistant. You help public visitors understand mify's 4 core service pillars:\n"
                           . "1. Jasa Pembuatan Website (using modern monolith Laravel + React + Inertia, 100% kustom, no cheap templates)\n"
                           . "2. Maintenance & Optimasi Server/Database\n"
                           . "3. Marketing Agency (data-driven acquisition, technical SEO & conversion rates)\n"
                           . "4. Engagement Helper (custom WhatsApp AI bots, lead qualification & CRM automation)\n\n"
                           . "Keep your responses concise (2-3 sentences max), highly professional, premium, and friendly. Respond in the same language as the user. Avoid generic AI slop phrases."
            ]
        ];

        foreach ($validated['messages'] as $msg) {
            $formattedMessages[] = [
                'role' => $msg['sender'] === 'user' ? 'user' : 'assistant',
                'content' => $msg['text'],
            ];
        }

        try {
            $response = Http::withoutVerifying()->withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($apiUrl, [
                'model' => $model,
                'messages' => $formattedMessages,
                'temperature' => 0.7,
                'max_tokens' => 512,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $reply = $data['choices'][0]['message']['content'] ?? null;
                if ($reply) {
                    return response()->json(['reply' => trim($reply)]);
                }
            }

            Log::error('NVIDIA API Error response: ' . $response->body());
            return response()->json([
                'reply' => 'Maaf, sistem asisten AI kami sedang sibuk saat ini. Silakan coba kembali beberapa saat lagi.'
            ], 502);

        } catch (\Exception $e) {
            Log::error('NVIDIA API exception: ' . $e->getMessage());
            return response()->json([
                'reply' => 'Terjadi kendala koneksi ke server AI kami. Mohon pastikan koneksi internet Anda stabil.'
            ], 500);
        }
    }
}
