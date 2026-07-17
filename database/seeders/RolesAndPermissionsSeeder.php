<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ─── Define Permissions per Module ───────────────────────────────────
        $permissions = [
            // CRM
            'view leads', 'create leads', 'edit leads', 'delete leads',
            'view clients', 'create clients', 'edit clients', 'delete clients',
            'view companies', 'create companies', 'edit companies', 'delete companies',
            'view quotations', 'create quotations', 'edit quotations', 'delete quotations',
            'view contracts', 'create contracts', 'edit contracts', 'delete contracts',

            // Projects
            'view projects', 'create projects', 'edit projects', 'delete projects',
            'view milestones', 'create milestones', 'edit milestones', 'delete milestones',
            'view tasks', 'create tasks', 'edit tasks', 'delete tasks',
            'view bugs', 'create bugs', 'edit bugs', 'delete bugs',
            'view files', 'upload files', 'delete files',

            // Finance
            'view invoices', 'create invoices', 'edit invoices', 'delete invoices',
            'view payments', 'create payments',
            'view expenses', 'create expenses', 'edit expenses', 'delete expenses',
            'view finance reports',

            // Hosting
            'view domains', 'create domains', 'edit domains', 'delete domains',
            'view hosting', 'create hosting', 'edit hosting', 'delete hosting',
            'view servers', 'create servers', 'edit servers', 'delete servers',
            'view ssl', 'create ssl', 'edit ssl', 'delete ssl',

            // Support
            'view tickets', 'create tickets', 'edit tickets', 'delete tickets',
            'reply tickets',

            // HR
            'view employees', 'create employees', 'edit employees', 'delete employees',
            'view attendance', 'manage attendance',
            'view leaves', 'manage leaves',
            'view payroll', 'manage payroll',

            // Reports
            'view reports',

            // Settings
            'view settings', 'manage settings',

            // Users & Roles
            'view users', 'create users', 'edit users', 'delete users',
            'view roles', 'create roles', 'edit roles', 'delete roles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // ─── Create Roles ─────────────────────────────────────────────────────
        $superAdmin   = Role::firstOrCreate(['name' => 'Super Admin']);
        $ceo          = Role::firstOrCreate(['name' => 'CEO']);
        $sales        = Role::firstOrCreate(['name' => 'Sales']);
        $pm           = Role::firstOrCreate(['name' => 'Project Manager']);
        $teamLeader   = Role::firstOrCreate(['name' => 'Team Leader']);
        $developer    = Role::firstOrCreate(['name' => 'Software Developer']);
        $designer     = Role::firstOrCreate(['name' => 'UI/UX Designer']);
        $qa           = Role::firstOrCreate(['name' => 'QA Tester']);
        $accountant   = Role::firstOrCreate(['name' => 'Accountant']);
        $hr           = Role::firstOrCreate(['name' => 'HR']);
        $support      = Role::firstOrCreate(['name' => 'Support']);
        $client       = Role::firstOrCreate(['name' => 'Client']);

        // ─── Assign Permissions to Roles ─────────────────────────────────────

        // CEO — full read + reports
        $ceo->syncPermissions([
            'view clients', 'view companies', 'view leads', 'view quotations', 'view contracts',
            'view projects', 'view milestones', 'view tasks', 'view bugs', 'view files',
            'view invoices', 'view payments', 'view expenses', 'view finance reports',
            'view domains', 'view hosting', 'view servers',
            'view employees', 'view payroll',
            'view reports', 'view users',
        ]);

        // Sales
        $sales->syncPermissions([
            'view leads', 'create leads', 'edit leads',
            'view clients', 'create clients', 'edit clients',
            'view companies', 'create companies', 'edit companies',
            'view quotations', 'create quotations', 'edit quotations',
        ]);

        // Project Manager
        $pm->syncPermissions([
            'view projects', 'create projects', 'edit projects',
            'view milestones', 'create milestones', 'edit milestones',
            'view tasks', 'create tasks', 'edit tasks', 'delete tasks',
            'view bugs', 'edit bugs',
            'view files', 'upload files',
            'view clients',
        ]);

        // Team Leader
        $teamLeader->syncPermissions([
            'view projects', 'view milestones',
            'view tasks', 'edit tasks',
            'view bugs', 'edit bugs',
            'view files', 'upload files',
        ]);

        // Developer
        $developer->syncPermissions([
            'view tasks', 'edit tasks',
            'view bugs', 'create bugs',
            'view files', 'upload files',
        ]);

        // Designer
        $designer->syncPermissions([
            'view tasks', 'edit tasks',
            'view files', 'upload files',
        ]);

        // QA
        $qa->syncPermissions([
            'view tasks',
            'view bugs', 'create bugs', 'edit bugs',
            'view files',
        ]);

        // Accountant
        $accountant->syncPermissions([
            'view invoices', 'create invoices', 'edit invoices',
            'view payments', 'create payments',
            'view expenses', 'create expenses', 'edit expenses',
            'view finance reports',
        ]);

        // HR
        $hr->syncPermissions([
            'view employees', 'create employees', 'edit employees',
            'view attendance', 'manage attendance',
            'view leaves', 'manage leaves',
            'view payroll', 'manage payroll',
        ]);

        // Support
        $support->syncPermissions([
            'view tickets', 'create tickets', 'edit tickets',
            'reply tickets',
        ]);

        // Client — very restricted
        $client->syncPermissions([
            'view projects',
            'view invoices',
            'view files',
            'view tickets', 'create tickets', 'reply tickets',
        ]);

        // ─── Create Super Admin User ──────────────────────────────────────────
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@theknowersystem.com'],
            [
                'name'     => 'Super Admin',
                'password' => bcrypt('Admin@123456'),
                'status'   => 'active',
            ]
        );
        $adminUser->assignRole('Super Admin');

        $this->command->info('✅ Roles, Permissions & Super Admin created successfully.');
        $this->command->info('📧 Email: admin@theknowersystem.com');
        $this->command->info('🔑 Password: Admin@123456');
    }
}
