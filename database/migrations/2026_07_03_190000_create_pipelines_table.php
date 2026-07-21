<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pipelines', function (Blueprint $table) {
            $table->id();
            $table->string('project_name');
            $table->string('client_name');
            $table->string('client_email');
            $table->json('tech_stack');
            $table->string('budget');
            $table->string('phase')->default('discovery'); // discovery, database_setup, core_features, deployment
            $table->string('health')->default('nominal'); // nominal, warning, critical
            $table->string('repo_commit')->nullable();
            $table->json('system_architecture');
            $table->date('deadline');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pipelines');
    }
};
