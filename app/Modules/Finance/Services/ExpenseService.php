<?php

namespace App\Modules\Finance\Services;

use App\Modules\Finance\Models\Expense;
use Illuminate\Database\Eloquent\Collection;

class ExpenseService
{
    public function getAll(): Collection
    {
        return Expense::orderBy("id", "desc")->get(); // Add default relations if needed
    }

    public function create(array $data): Expense
    {
        return Expense::create($data);
    }

    public function update(Expense $expense, array $data): Expense
    {
        $expense->update($data);
        return $expense;
    }

    public function delete(Expense $expense): ?bool
    {
        return $expense->delete();
    }
}
