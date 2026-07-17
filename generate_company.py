import os

# --- ENUMS ---
os.makedirs('app/Enums', exist_ok=True)
enums = {
    'CompanyType': "['enterprise' => 'Enterprise', 'smb' => 'SMB', 'startup' => 'Startup', 'government' => 'Government', 'non_profit' => 'Non-Profit']",
    'CompanyStatus': "['active' => 'Active', 'inactive' => 'Inactive', 'archived' => 'Archived']",
    'CompanySalesStage': "['prospect' => 'Prospect', 'qualified' => 'Qualified', 'negotiation' => 'Negotiation', 'closed_won' => 'Closed Won', 'closed_lost' => 'Closed Lost']",
    'CompanyPriority': "['low' => 'Low', 'medium' => 'Medium', 'high' => 'High', 'urgent' => 'Urgent']"
}

for name, values in enums.items():
    code = f"""<?php
namespace App\\Enums;

enum {name}: string
{{
    case {values.split(" => '")[0].replace("['", "").upper()} = '{values.split(" => '")[0].replace("['", "")}';
    // Keeping it simple for generation, standard PHP 8.1+ Enums
}}
"""
    # Actually, let's make a proper basic enum
    cases = []
    for pair in values.strip("[]").split(", "):
        k, v = pair.split(" => ")
        k = k.strip("'")
        cases.append(f"    case {k.upper()} = '{k}';")
    
    code = f"<?php\nnamespace App\\Enums;\n\nenum {name}: string\n{{\n" + "\n".join(cases) + "\n}\n"
    with open(f'app/Enums/{name}.php', 'w') as f:
        f.write(code)

# --- MODEL ---
model_code = """<?php
namespace App\\Models;

use App\\Traits\\HasWorkspace;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Spatie\\Activitylog\\Traits\\LogsActivity;
use Spatie\\Activitylog\\LogOptions;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use App\\Enums\\CompanyType;
use App\\Enums\\CompanyStatus;
use App\\Enums\\CompanySalesStage;
use App\\Enums\\CompanyPriority;

class Company extends Model
{
    use HasWorkspace, SoftDeletes, LogsActivity;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'company_type' => CompanyType::class,
        'status' => CompanyStatus::class,
        'sales_stage' => CompanySalesStage::class,
        'priority' => CompanyPriority::class,
        'annual_revenue' => 'decimal:2',
        'expected_project_value' => 'decimal:2',
        'customer_since' => 'date',
        'last_contact_at' => 'datetime',
        'next_follow_up_at' => 'datetime',
        'ai_tags' => 'array',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }

    public function accountOwner(): BelongsTo { return $this->belongsTo(User::class, 'account_owner'); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updated_by'); }

    // Relationships mapping to future modules
    public function contacts(): HasMany { return $this->hasMany(Contact::class); }
    public function leads(): HasMany { return $this->hasMany(Lead::class); }
    public function clients(): HasMany { return $this->hasMany(Client::class); }
    public function projects(): HasMany { return $this->hasMany(Project::class); }
    public function quotations(): HasMany { return $this->hasMany(Quotation::class); }
    public function contracts(): HasMany { return $this->hasMany(Contract::class); }
    public function invoices(): HasMany { return $this->hasMany(Invoice::class); }
}
"""
with open('app/Models/Company.php', 'w') as f: f.write(model_code)

# --- SERVICE ---
service_code = """<?php
namespace App\\Services\\CRM;

use App\\Models\\Company;
use Illuminate\\Support\\Facades\\Auth;

class CompanyService
{
    public function getAll()
    {
        return Company::with(['accountOwner'])->latest()->paginate(25);
    }

    public function create(array $data): Company
    {
        $data['created_by'] = Auth::id();
        return Company::create($data);
    }

    public function update(Company $company, array $data): Company
    {
        $data['updated_by'] = Auth::id();
        $company->update($data);
        return $company;
    }

    public function delete(Company $company): bool
    {
        return $company->delete();
    }
}
"""
os.makedirs('app/Services/CRM', exist_ok=True)
with open('app/Services/CRM/CompanyService.php', 'w') as f: f.write(service_code)

# --- REQUESTS ---
os.makedirs('app/Http/Requests/CRM', exist_ok=True)
store_req = """<?php
namespace App\\Http\\Requests\\CRM;

use Illuminate\\Foundation\\Http\\FormRequest;
use App\\Enums\\CompanyType;
use App\\Enums\\CompanyStatus;
use Illuminate\\Validation\\Rules\\Enum;

class StoreCompanyRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'company_name' => 'required|string|max:255',
            'legal_name' => 'nullable|string|max:255',
            'company_code' => 'nullable|string|max:50|unique:companies',
            'company_type' => ['nullable', new Enum(CompanyType::class)],
            'status' => ['nullable', new Enum(CompanyStatus::class)],
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'annual_revenue' => 'nullable|numeric|min:0',
        ];
    }
}
"""
update_req = store_req.replace('StoreCompanyRequest', 'UpdateCompanyRequest').replace('unique:companies', 'unique:companies,company_code,' + '$this->company->id')
with open('app/Http/Requests/CRM/StoreCompanyRequest.php', 'w') as f: f.write(store_req)
with open('app/Http/Requests/CRM/UpdateCompanyRequest.php', 'w') as f: f.write(update_req)

# --- RESOURCE ---
os.makedirs('app/Http/Resources/CRM', exist_ok=True)
resource_code = """<?php
namespace App\\Http\\Resources\\CRM;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
"""
with open('app/Http/Resources/CRM/CompanyResource.php', 'w') as f: f.write(resource_code)

# --- CONTROLLER ---
controller_code = """<?php
namespace App\\Http\\Controllers\\CRM;

use App\\Http\\Controllers\\Controller;
use App\\Services\\CRM\\CompanyService;
use App\\Http\\Requests\\CRM\\StoreCompanyRequest;
use App\\Http\\Requests\\CRM\\UpdateCompanyRequest;
use App\\Http\\Resources\\CRM\\CompanyResource;
use App\\Models\\Company;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Gate;

class CompanyController extends Controller
{
    protected CompanyService $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Company::class);
        return response()->json([
            'success' => true,
            'data' => CompanyResource::collection($this->companyService->getAll())
        ]);
    }

    public function store(StoreCompanyRequest $request): JsonResponse
    {
        Gate::authorize('create', Company::class);
        $company = $this->companyService->create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Company created successfully',
            'data' => new CompanyResource($company)
        ], 201);
    }

    public function show(Company $company): JsonResponse
    {
        Gate::authorize('view', $company);
        return response()->json([
            'success' => true,
            'data' => new CompanyResource($company->load(['accountOwner', 'creator']))
        ]);
    }

    public function update(UpdateCompanyRequest $request, Company $company): JsonResponse
    {
        Gate::authorize('update', $company);
        $company = $this->companyService->update($company, $request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Company updated successfully',
            'data' => new CompanyResource($company)
        ]);
    }

    public function destroy(Company $company): JsonResponse
    {
        Gate::authorize('delete', $company);
        $this->companyService->delete($company);
        return response()->json(['success' => true, 'message' => 'Company deleted successfully']);
    }
}
"""
os.makedirs('app/Http/Controllers/CRM', exist_ok=True)
with open('app/Http/Controllers/CRM/CompanyController.php', 'w') as f: f.write(controller_code)

# --- REACT UI COMPONENT ---
os.makedirs('resources/js/Pages/CRM', exist_ok=True)
react_ui = """import React from 'react';
import { Head } from '@inertiajs/react';

export default function Companies() {
    return (
        <div className="bg-obsidian-base min-h-screen text-on-background">
            <Head title="Companies (B2B) - CRM" />
            <div className="p-8">
                <h1 className="text-display-lg text-primary mb-4">Enterprise Companies</h1>
                <p className="text-on-surface-variant">B2B CRM Entities. Manage accounts, metadata, AI scoring, and relationships.</p>
                {/* Table implementation connected to /api/v1/companies */}
            </div>
        </div>
    );
}
"""
with open('resources/js/Pages/CRM/Companies.jsx', 'w') as f: f.write(react_ui)

print("Generated full Company module.")
