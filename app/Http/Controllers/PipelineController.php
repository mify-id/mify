<?php

namespace App\Http\Controllers;

use App\Models\Pipeline;
use App\Models\Brief;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PipelineController extends Controller
{
    /**
     * Display a listing of pipelines.
     */
    public function index()
    {
        return Inertia::render('Pipelines/Index', [
            'pipelines' => Pipeline::latest()->get(),
            'approvedBriefs' => Brief::where('status', 'approved')->latest()->get(),
        ]);
    }

    /**
     * Store a newly created pipeline in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'client_name' => 'required|string|max:255',
            'client_email' => 'required|email|max:255',
            'tech_stack' => 'required|array',
            'budget' => 'required|string|max:255',
            'phase' => 'required|string|in:discovery,database_setup,core_features,deployment',
            'health' => 'required|string|in:nominal,warning,critical',
            'repo_commit' => 'nullable|string|max:255',
            'system_architecture' => 'required|array',
            'deadline' => 'required|date',
            'brief_id' => 'nullable|integer|exists:briefs,id',
        ]);

        $pipeline = Pipeline::create($validated);

        // If converted from a client brief
        if ($request->filled('brief_id')) {
            $brief = Brief::find($request->brief_id);
            AuditLog::create([
                'event' => "Brief for {$brief->company} converted into Active Pipeline: {$pipeline->project_name}",
                'ip' => $request->ip() ?? '127.0.0.1',
            ]);
        } else {
            AuditLog::create([
                'event' => "New Pipeline created manually: {$pipeline->project_name}",
                'ip' => $request->ip() ?? '127.0.0.1',
            ]);
        }

        return redirect()->back()->with('success', 'Pipeline created successfully.');
    }

    /**
     * Update the specified pipeline in storage.
     */
    public function update(Request $request, Pipeline $pipeline)
    {
        $validated = $request->validate([
            'project_name' => 'sometimes|required|string|max:255',
            'client_name' => 'sometimes|required|string|max:255',
            'client_email' => 'sometimes|required|email|max:255',
            'tech_stack' => 'sometimes|required|array',
            'budget' => 'sometimes|required|string|max:255',
            'phase' => 'sometimes|required|string|in:discovery,database_setup,core_features,deployment',
            'health' => 'sometimes|required|string|in:nominal,warning,critical',
            'repo_commit' => 'nullable|string|max:255',
            'system_architecture' => 'sometimes|required|array',
            'deadline' => 'sometimes|required|date',
        ]);

        $oldPhase = $pipeline->phase;
        $oldHealth = $pipeline->health;

        $pipeline->update($validated);

        $changes = [];
        if ($oldPhase !== $pipeline->phase) {
            $changes[] = "phase '{$oldPhase}' -> '{$pipeline->phase}'";
        }
        if ($oldHealth !== $pipeline->health) {
            $changes[] = "health '{$oldHealth}' -> '{$pipeline->health}'";
        }

        $eventMsg = "Pipeline updated: {$pipeline->project_name}";
        if (!empty($changes)) {
            $eventMsg .= " (" . implode(', ', $changes) . ")";
        }

        AuditLog::create([
            'event' => $eventMsg,
            'ip' => $request->ip() ?? '127.0.0.1',
        ]);

        return redirect()->back()->with('success', 'Pipeline updated successfully.');
    }

    /**
     * Remove the specified pipeline from storage.
     */
    public function destroy(Request $request, Pipeline $pipeline)
    {
        $projectName = $pipeline->project_name;
        $pipeline->delete();

        AuditLog::create([
            'event' => "Pipeline deleted: {$projectName}",
            'ip' => $request->ip() ?? '127.0.0.1',
        ]);

        return redirect()->back()->with('success', 'Pipeline deleted successfully.');
    }
}
