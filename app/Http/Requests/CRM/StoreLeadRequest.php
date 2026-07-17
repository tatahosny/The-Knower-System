<?php
namespace App\Http\Requests\CRM;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\LeadPipelineStage;
use App\Enums\LeadSource;
use Illuminate\Validation\Rules\Enum;

class StoreLeadRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'title' => 'required|string|max:255',
            'company_id' => 'nullable|exists:companies,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'assigned_to' => 'nullable|exists:users,id',
            'pipeline_stage' => ['nullable', new Enum(LeadPipelineStage::class)],
            'lead_value' => 'nullable|numeric|min:0',
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'lead_source' => ['nullable', new Enum(LeadSource::class)],
            'lost_reason' => 'required_if:pipeline_stage,lost|nullable|string',
        ];
    }
}
