<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'company_name', 'industry', 'website',
        'tax_number', 'address', 'city', 'country', 'notes',
    ];

    public function clients()
    {
        return $this->hasMany(Client::class);
    }
}
