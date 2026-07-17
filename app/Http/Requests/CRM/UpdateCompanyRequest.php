<?php
namespace App\Http\Requests\CRM;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\CompanyType;
use App\Enums\CompanyStatus;
use Illuminate\Validation\Rules\Enum;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'company_name' => 'required|string|max:255',
            'legal_name' => 'nullable|string|max:255',
            'company_code' => 'nullable|string|max:50|unique:companies,company_code,$this->company->id',
            'company_type' => ['nullable', new Enum(CompanyType::class)],
            'status' => ['nullable', new Enum(CompanyStatus::class)],
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'annual_revenue' => 'nullable|numeric|min:0',
        ];
    }
}
