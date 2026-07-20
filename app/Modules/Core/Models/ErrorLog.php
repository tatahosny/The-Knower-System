<?php

namespace App\Modules\Core\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Auth\Models\User;
use App\Modules\Settings\Models\Workspace;

class ErrorLog extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'headers' => 'array',
        'request_payload' => 'array',
        'response_payload' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }
}
