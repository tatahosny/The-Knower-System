<?php

namespace App\Modules\CMS\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\HasWorkspace;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class TeamMember extends Model
{
    use HasWorkspace, LogsActivity;

    protected $guarded = [];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}
