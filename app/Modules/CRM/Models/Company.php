<?php
namespace App\Modules\CRM\Models;

use App\Traits\HasWorkspace;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Enums\CompanyType;
use App\Enums\CompanyStatus;
use App\Enums\CompanySalesStage;
use App\Enums\CompanyPriority;

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
