<?php

namespace App\Traits;

use App\Core\Scopes\TenantScope;
use App\Modules\Settings\Models\Workspace;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasWorkspace
{
    protected static function bootHasWorkspace(): void
    {
        static::addGlobalScope(new TenantScope);

        static::creating(function ($model) {
            if (auth()->hasUser() && empty($model->workspace_id)) {
                $model->workspace_id = auth()->user()->current_workspace_id ?? 1;
            }
        });
    }

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }
}
