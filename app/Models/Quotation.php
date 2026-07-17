<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    protected $fillable = [
        'client_id', 'quotation_number', 'price', 'currency', 'status', 'valid_until', 'notes',
    ];

    protected $casts = [
        'valid_until' => 'date',
        'price' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function contract()
    {
        return $this->hasOne(Contract::class);
    }
}
