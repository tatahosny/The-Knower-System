<?php

namespace App\Modules\Hosting\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHostingAccountRequest extends FormRequest
{
    public function authorize(): bool
    { return true; }

    public function rules(): array
    { return []; }
}
