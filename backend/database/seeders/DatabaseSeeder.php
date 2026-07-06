<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@omar.dev'],
            [
                'name' => 'Omar Mohamed',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $this->call([
            StaticApiKeySeeder::class,
            DemoDataSeeder::class,
        ]);
    }
}
