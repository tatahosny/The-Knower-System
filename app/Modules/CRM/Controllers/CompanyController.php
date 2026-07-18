<?php
namespace App\Modules\CRM\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Services\CompanyService;
use App\Modules\CRM\Requests\StoreCompanyRequest;
use App\Modules\CRM\Requests\UpdateCompanyRequest;
use App\Http\Resources\CRM\CompanyResource;
use App\Modules\CRM\Models\Company;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

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
