<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CompanyPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_companies');
    }

    public function view(User $user, Company $company): bool
    {
        return $user->hasPermissionTo('view_companies');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_companies');
    }

    public function update(User $user, Company $company): bool
    {
        return $user->hasPermissionTo('edit_companies');
    }

    public function delete(User $user, Company $company): bool
    {
        return $user->hasPermissionTo('delete_companies');
    }
}
