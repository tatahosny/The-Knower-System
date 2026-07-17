<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SslCertificate extends Model
{
    protected $table = 'ssl_certificates';

    protected $fillable = [
        'domain_id', 'provider', 'expiry_date', 'status',
    ];

    protected $casts = [
        'expiry_date' => 'date',
    ];

    public $timestamps = false;

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }
}
