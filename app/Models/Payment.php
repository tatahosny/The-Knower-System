<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'invoice_id', 'method', 'amount', 'paid_at', 'reference',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public $timestamps = false;

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
