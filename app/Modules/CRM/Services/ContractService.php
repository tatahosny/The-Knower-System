<?php

namespace App\Modules\CRM\Services;

use App\Modules\CRM\Models\Contract;
use Illuminate\Database\Eloquent\Collection;

class ContractService
{
    public function getAll(): Collection
    {
        return Contract::latest()->get(); // Add default relations if needed
    }

    public function create(array $data): Contract
    {
        return Contract::create($data);
    }

    public function update(Contract $contract, array $data): Contract
    {
        $contract->update($data);
        return $contract;
    }

    public function delete(Contract $contract): ?bool
    {
        return $contract->delete();
    }
}
