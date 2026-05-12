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
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @return void
     */
    public function run(): void
    {
        $adminRole = Role::where('name', 'Admin')->first();

        if ($adminRole) {
            User::firstOrCreate(
                ['email' => 'admin@ironlung.ac.id'],
                [
                    'password' => Hash::make('Admin123!'),
                    'role_id' => $adminRole->id,
                    'is_active' => true
                ]
            );
            
            // Tambahkan admin test
            User::firstOrCreate(
                ['email' => 'admin@test.com'],
                [
                    'password' => Hash::make('password'),
                    'role_id' => $adminRole->id,
                    'is_active' => true
                ]
            );
        }
        
        $studentRole = Role::where('name', 'Student')->first();
        if ($studentRole) {
            User::firstOrCreate(
                ['email' => 'student@test.com'],
                [
                    'password' => Hash::make('password'),
                    'role_id' => $studentRole->id,
                    'is_active' => true
                ]
            );
        }

        $partnerRole = Role::where('name', 'Partner')->first();
        if ($partnerRole) {
            User::firstOrCreate(
                ['email' => 'partner@test.com'],
                [
                    'password' => Hash::make('password'),
                    'role_id' => $partnerRole->id,
                    'is_active' => true
                ]
            );
        }
    }
}
