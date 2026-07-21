<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Display a listing of portfolio items for Admin.
     */
    public function index()
    {
        return Inertia::render('Portfolios/Index', [
            'portfolios' => Portfolio::orderBy('order', 'asc')->latest()->get(),
            'categories' => ['Web System', 'Mobile App', 'AI Automation', 'Marketing System', 'E-Commerce'],
        ]);
    }

    /**
     * Store a newly created portfolio item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'image_url_input' => 'nullable|string|max:1000',
            'project_url' => 'nullable|string|max:255',
            'tech_stack' => 'nullable|array',
            'tech_stack.*' => 'string',
            'is_featured' => 'boolean',
            'order' => 'integer',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('portfolios', 'public');
        } elseif (!empty($validated['image_url_input'])) {
            $imagePath = $validated['image_url_input'];
        }

        $slug = Str::slug($validated['title']) . '-' . Str::random(4);

        $portfolio = Portfolio::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'category' => $validated['category'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
            'project_url' => $validated['project_url'] ?? null,
            'tech_stack' => $validated['tech_stack'] ?? ['Laravel', 'React'],
            'is_featured' => $request->boolean('is_featured', true),
            'order' => $validated['order'] ?? 0,
        ]);

        AuditLog::create([
            'event' => "Created new portfolio project: {$portfolio->title}",
            'ip' => $request->ip() ?: '127.0.0.1',
        ]);

        return redirect()->back()->with('success', 'Portfolio project created successfully.');
    }

    /**
     * Update the specified portfolio item.
     */
    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'image_url_input' => 'nullable|string|max:1000',
            'project_url' => 'nullable|string|max:255',
            'tech_stack' => 'nullable|array',
            'tech_stack.*' => 'string',
            'is_featured' => 'boolean',
            'order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            // Remove old image if local
            if ($portfolio->image_path && !Str::startsWith($portfolio->image_path, ['http://', 'https://'])) {
                Storage::disk('public')->delete($portfolio->image_path);
            }
            $portfolio->image_path = $request->file('image')->store('portfolios', 'public');
        } elseif (!empty($validated['image_url_input'])) {
            $portfolio->image_path = $validated['image_url_input'];
        }

        $portfolio->title = $validated['title'];
        $portfolio->category = $validated['category'];
        $portfolio->description = $validated['description'];
        $portfolio->project_url = $validated['project_url'] ?? null;
        if (isset($validated['tech_stack'])) {
            $portfolio->tech_stack = $validated['tech_stack'];
        }
        $portfolio->is_featured = $request->boolean('is_featured');
        if (isset($validated['order'])) {
            $portfolio->order = $validated['order'];
        }

        $portfolio->save();

        AuditLog::create([
            'event' => "Updated portfolio project: {$portfolio->title}",
            'ip' => $request->ip() ?: '127.0.0.1',
        ]);

        return redirect()->back()->with('success', 'Portfolio project updated successfully.');
    }

    /**
     * Remove the specified portfolio item.
     */
    public function destroy(Request $request, Portfolio $portfolio)
    {
        $title = $portfolio->title;

        if ($portfolio->image_path && !Str::startsWith($portfolio->image_path, ['http://', 'https://'])) {
            Storage::disk('public')->delete($portfolio->image_path);
        }

        $portfolio->delete();

        AuditLog::create([
            'event' => "Deleted portfolio project: {$title}",
            'ip' => $request->ip() ?: '127.0.0.1',
        ]);

        return redirect()->back()->with('success', 'Portfolio project deleted successfully.');
    }
}
