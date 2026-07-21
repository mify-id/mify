<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $portfolios = [];
    if (\Illuminate\Support\Facades\Schema::hasTable('portfolios')) {
        $portfolios = \App\Models\Portfolio::where('is_featured', true)->orderBy('order', 'asc')->latest()->get();
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'portfolios' => $portfolios,
    ]);
});

Route::get('/dashboard', function () {
    $dbPath = database_path('database.sqlite');
    $dbSize = file_exists($dbPath) ? round(filesize($dbPath) / 1024) . ' KB' : 'N/A';

    // Health check for Open Design Daemon (port 7456)
    $odSocket = @fsockopen('127.0.0.1', 7456, $errno, $errstr, 0.2);
    $openDesignStatus = $odSocket ? 'active' : 'offline';
    if ($odSocket) fclose($odSocket);

    // Health check for Vite Dev Server (port 5173)
    $viteSocket = @fsockopen('127.0.0.1', 5173, $errno, $errstr, 0.2);
    $viteStatus = $viteSocket ? 'active' : 'offline';
    if ($viteSocket) fclose($viteSocket);

    // Get latest git commit using native php shell_exec
    $gitCommit = trim(@shell_exec('git log -1 --pretty=format:"%h - %s (%ar)"') ?? 'N/A');

    return Inertia::render('Dashboard', [
        'briefs' => \App\Models\Brief::latest()->get(),
        'dbSize' => $dbSize,
        'adminCount' => \App\Models\User::count(),
        'auditLogs' => \App\Models\AuditLog::latest()->take(5)->get(),
        'openDesignStatus' => $openDesignStatus,
        'viteStatus' => $viteStatus,
        'gitCommit' => $gitCommit,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');
Route::post('/briefs', [\App\Http\Controllers\BriefController::class, 'store'])->name('briefs.store');
Route::post('/chat', [\App\Http\Controllers\ChatController::class, 'handle'])->name('chat.handle');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Brief actions
    Route::get('/dashboard/briefs', [\App\Http\Controllers\BriefController::class, 'index'])->name('briefs.index');
    Route::patch('/briefs/{brief}/status', [\App\Http\Controllers\BriefController::class, 'updateStatus'])->name('briefs.update-status');
    Route::patch('/briefs/{brief}/notes-priority', [\App\Http\Controllers\BriefController::class, 'updateNotesPriority'])->name('briefs.update-notes-priority');
    Route::delete('/briefs/{brief}', [\App\Http\Controllers\BriefController::class, 'destroy'])->name('briefs.destroy');
    Route::post('/briefs/{brief}/blueprint', [\App\Http\Controllers\BriefController::class, 'generateBlueprint'])->name('briefs.generate-blueprint');

    // Pipeline actions
    Route::get('/dashboard/pipelines', [\App\Http\Controllers\PipelineController::class, 'index'])->name('pipelines.index');
    Route::post('/dashboard/pipelines', [\App\Http\Controllers\PipelineController::class, 'store'])->name('pipelines.store');
    Route::patch('/dashboard/pipelines/{pipeline}', [\App\Http\Controllers\PipelineController::class, 'update'])->name('pipelines.update');
    Route::delete('/dashboard/pipelines/{pipeline}', [\App\Http\Controllers\PipelineController::class, 'destroy'])->name('pipelines.destroy');

    // Portfolio actions
    Route::get('/dashboard/portfolios', [\App\Http\Controllers\PortfolioController::class, 'index'])->name('portfolios.index');
    Route::post('/dashboard/portfolios', [\App\Http\Controllers\PortfolioController::class, 'store'])->name('portfolios.store');
    Route::post('/dashboard/portfolios/{portfolio}', [\App\Http\Controllers\PortfolioController::class, 'update'])->name('portfolios.update');
    Route::delete('/dashboard/portfolios/{portfolio}', [\App\Http\Controllers\PortfolioController::class, 'destroy'])->name('portfolios.destroy');
});

require __DIR__.'/auth.php';
