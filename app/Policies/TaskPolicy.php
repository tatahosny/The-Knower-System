<?php

namespace App\Policies;

use App\Modules\Projects\Models\Task;
use App\Modules\Auth\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_tasks');
    }

    public function view(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('view_tasks');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_tasks');
    }

    public function update(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('edit_tasks');
    }

    public function delete(User $user, Task $task): bool
    {
        return $user->hasPermissionTo('delete_tasks');
    }
}
