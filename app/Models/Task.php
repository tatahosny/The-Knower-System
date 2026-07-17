<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'project_id', 'milestone_id', 'assigned_to', 'title', 'description',
        'status', 'priority', 'start_date', 'due_date', 'estimated_hours', 'actual_hours',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date'   => 'date',
    ];

    public function project()   { return $this->belongsTo(Project::class); }
    public function milestone() { return $this->belongsTo(Milestone::class); }
    public function assignee()  { return $this->belongsTo(User::class, 'assigned_to'); }
    public function comments()  { return $this->hasMany(TaskComment::class); }
    public function bugs()      { return $this->hasMany(Bug::class); }

    public function isOverdue(): bool
    {
        return $this->due_date && $this->due_date->isPast() && $this->status !== 'done';
    }
}
