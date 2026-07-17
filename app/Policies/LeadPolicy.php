<?php
namespace App\Policies;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LeadPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool { return $user->hasPermissionTo('view_leads'); }
    public function view(User $user, Lead $lead): bool { return $user->hasPermissionTo('view_leads'); }
    public function create(User $user): bool { return $user->hasPermissionTo('create_leads'); }
    public function update(User $user, Lead $lead): bool { return $user->hasPermissionTo('edit_leads'); }
    public function delete(User $user, Lead $lead): bool { return $user->hasPermissionTo('delete_leads'); }
}
