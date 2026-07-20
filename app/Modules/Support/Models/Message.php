<?php

namespace App\Modules\Support\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Auth\Models\User;

class Message extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'attachments' => 'array',
        'internal_flag' => 'boolean',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
