import os
import datetime

# --- ENUMS ---
os.makedirs('app/Enums', exist_ok=True)
enums = {
    'LeadPipelineStage': "['new' => 'New', 'contacted' => 'Contacted', 'qualified' => 'Qualified', 'proposal' => 'Proposal', 'negotiation' => 'Negotiation', 'won' => 'Won', 'lost' => 'Lost']",
    'LeadSource': "['website' => 'Website', 'referral' => 'Referral', 'linkedin' => 'LinkedIn', 'cold_call' => 'Cold Call', 'event' => 'Event', 'other' => 'Other']",
}

for name, values in enums.items():
    cases = []
    for pair in values.strip("[]").split(", "):
        k, v = pair.split(" => ")
        k = k.strip("'")
        cases.append(f"    case {k.upper()} = '{k}';")
    code = f"<?php\nnamespace App\\Enums;\n\nenum {name}: string\n{{\n" + "\n".join(cases) + "\n}\n"
    with open(f'app/Enums/{name}.php', 'w') as f:
        f.write(code)

# --- MIGRATION ---
migration = """<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('leads');
        
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            
            $table->string('title')->index(); // e.g. "ERP System Upgrade"
            
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();
            $table->foreignId('contact_id')->nullable()->constrained('contacts')->nullOnDelete();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('pipeline_stage')->default('new')->index();
            $table->decimal('lead_value', 15, 2)->nullable();
            $table->integer('probability')->default(0);
            $table->date('expected_close_date')->nullable();
            
            $table->string('lead_source')->nullable();
            $table->text('lost_reason')->nullable();
            
            $table->integer('ai_score')->nullable();
            $table->text('ai_summary')->nullable();
            $table->string('ai_sentiment')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
"""
date_str = datetime.datetime.now().strftime("%Y_%m_%d_%H%M%S")
with open(f'database/migrations/{date_str}_rebuild_leads_table.php', 'w') as f:
    f.write(migration)

# --- MODEL ---
model_code = """<?php
namespace App\\Models;

use App\\Traits\\HasWorkspace;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Spatie\\Activitylog\\Traits\\LogsActivity;
use Spatie\\Activitylog\\LogOptions;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use App\\Enums\\LeadPipelineStage;
use App\\Enums\\LeadSource;

class Lead extends Model
{
    use HasWorkspace, SoftDeletes, LogsActivity;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'pipeline_stage' => LeadPipelineStage::class,
        'lead_source' => LeadSource::class,
        'lead_value' => 'decimal:2',
        'probability' => 'integer',
        'expected_close_date' => 'date',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function contact(): BelongsTo { return $this->belongsTo(Contact::class); }
    public function assignee(): BelongsTo { return $this->belongsTo(User::class, 'assigned_to'); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updated_by'); }
}
"""
with open('app/Models/Lead.php', 'w') as f: f.write(model_code)

# --- SERVICE ---
service_code = """<?php
namespace App\\Services\\CRM;

use App\\Models\\Lead;
use Illuminate\\Support\\Facades\\Auth;

class LeadService
{
    public function getAll()
    {
        return Lead::with(['company', 'contact', 'assignee'])->latest()->paginate(25);
    }

    public function create(array $data): Lead
    {
        $data['created_by'] = Auth::id();
        return Lead::create($data);
    }

    public function update(Lead $lead, array $data): Lead
    {
        $data['updated_by'] = Auth::id();
        $lead->update($data);
        return $lead;
    }

    public function delete(Lead $lead): bool
    {
        return $lead->delete();
    }
}
"""
with open('app/Services/CRM/LeadService.php', 'w') as f: f.write(service_code)

# --- REQUESTS ---
store_req = """<?php
namespace App\\Http\\Requests\\CRM;

use Illuminate\\Foundation\\Http\\FormRequest;
use App\\Enums\\LeadPipelineStage;
use App\\Enums\\LeadSource;
use Illuminate\\Validation\\Rules\\Enum;

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
"""
update_req = store_req.replace('StoreLeadRequest', 'UpdateLeadRequest')
with open('app/Http/Requests/CRM/StoreLeadRequest.php', 'w') as f: f.write(store_req)
with open('app/Http/Requests/CRM/UpdateLeadRequest.php', 'w') as f: f.write(update_req)

# --- RESOURCE ---
resource_code = """<?php
namespace App\\Http\\Resources\\CRM;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class LeadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
"""
with open('app/Http/Resources/CRM/LeadResource.php', 'w') as f: f.write(resource_code)

# --- CONTROLLER ---
controller_code = """<?php
namespace App\\Http\\Controllers\\CRM;

use App\\Http\\Controllers\\Controller;
use App\\Services\\CRM\\LeadService;
use App\\Http\\Requests\\CRM\\StoreLeadRequest;
use App\\Http\\Requests\\CRM\\UpdateLeadRequest;
use App\\Http\\Resources\\CRM\\LeadResource;
use App\\Models\\Lead;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Gate;

class LeadController extends Controller
{
    protected LeadService $leadService;

    public function __construct(LeadService $leadService)
    {
        $this->leadService = $leadService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Lead::class);
        return response()->json([
            'success' => true,
            'data' => LeadResource::collection($this->leadService->getAll())
        ]);
    }

    public function store(StoreLeadRequest $request): JsonResponse
    {
        Gate::authorize('create', Lead::class);
        $lead = $this->leadService->create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully',
            'data' => new LeadResource($lead)
        ], 201);
    }

    public function show(Lead $lead): JsonResponse
    {
        Gate::authorize('view', $lead);
        return response()->json([
            'success' => true,
            'data' => new LeadResource($lead->load(['company', 'contact', 'assignee']))
        ]);
    }

    public function update(UpdateLeadRequest $request, Lead $lead): JsonResponse
    {
        Gate::authorize('update', $lead);
        $lead = $this->leadService->update($lead, $request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully',
            'data' => new LeadResource($lead)
        ]);
    }

    public function destroy(Lead $lead): JsonResponse
    {
        Gate::authorize('delete', $lead);
        $this->leadService->delete($lead);
        return response()->json(['success' => true, 'message' => 'Lead deleted successfully']);
    }
}
"""
with open('app/Http/Controllers/CRM/LeadController.php', 'w') as f: f.write(controller_code)

# --- POLICY ---
policy_code = """<?php
namespace App\\Policies;

use App\\Models\\Lead;
use App\\Models\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class LeadPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool { return $user->hasPermissionTo('view_leads'); }
    public function view(User $user, Lead $lead): bool { return $user->hasPermissionTo('view_leads'); }
    public function create(User $user): bool { return $user->hasPermissionTo('create_leads'); }
    public function update(User $user, Lead $lead): bool { return $user->hasPermissionTo('edit_leads'); }
    public function delete(User $user, Lead $lead): bool { return $user->hasPermissionTo('delete_leads'); }
}
"""
with open('app/Policies/LeadPolicy.php', 'w') as f: f.write(policy_code)

# --- REACT UI COMPONENT ---
react_ui = """import React from 'react';
import { Head } from '@inertiajs/react';

export default function Leads() {
    return (
        <div className="bg-obsidian-base min-h-screen text-on-background">
            <Head title="Leads (Opportunities) - CRM" />
            <div className="p-8">
                <h1 className="text-display-lg text-primary mb-4">Sales Pipeline</h1>
                <p className="text-on-surface-variant">Manage B2B Sales Opportunities via Kanban Board or Data Table.</p>
                {/* Kanban / Table implementation connected to /api/v1/leads */}
            </div>
        </div>
    );
}
"""
with open('resources/js/Pages/CRM/Leads.jsx', 'w') as f: f.write(react_ui)

print("Generated full Lead module.")
