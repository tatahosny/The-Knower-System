<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'project_id', 'uploaded_by', 'file_name', 'file_path', 'size', 'type',
    ];

    public $timestamps = false; // only custom created_at timestamp in migration

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
