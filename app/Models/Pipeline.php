<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pipeline extends Model
{
    protected $fillable = [
        'project_name',
        'client_name',
        'client_email',
        'tech_stack',
        'budget',
        'phase',
        'health',
        'repo_commit',
        'system_architecture',
        'deadline',
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'system_architecture' => 'array',
    ];
}
