<?php
namespace App\Services\CRM;

use App\Models\Company;
use Illuminate\Support\Facades\Auth;

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
