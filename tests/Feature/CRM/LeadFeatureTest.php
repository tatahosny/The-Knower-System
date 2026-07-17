<?php

namespace Tests\Feature\CRM;

use App\Models\Lead;
use App\Models\Company;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeadFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_authorized_user_can_create_lead()
    {
        $user = User::factory()->create();
        Permission::firstOrCreate(['name' => 'create_leads']);
        $role = Role::firstOrCreate(['name' => 'Sales Manager']);
        $role->givePermissionTo('create_leads');
        $user->assignRole($role);
        
        $company = Company::create(['company_name' => 'Wayne Enterprises']);

        $response = $this->actingAs($user)->postJson('/api/v1/leads', [
            'title' => 'Security System Upgrade',
            'company_id' => $company->id,
            'pipeline_stage' => 'new',
            'lead_value' => 50000.00,
            'probability' => 20
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Security System Upgrade');
                 
        $this->assertDatabaseHas('leads', [
            'title' => 'Security System Upgrade',
            'company_id' => $company->id,
            'lead_value' => 50000.00
        ]);
    }
}
