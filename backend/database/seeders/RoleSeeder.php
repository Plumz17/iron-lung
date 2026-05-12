<?php
/**
 * @module  Auth
 * @desc    Modul autentikasi dan otorisasi pengguna (JWT + RBAC)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @return void
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Student', 'description' => 'Mahasiswa'],
            ['name' => 'Partner', 'description' => 'Mitra Industri'],
            ['name' => 'Admin', 'description' => 'Administrator Sistem']
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}
