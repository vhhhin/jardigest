<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Jardinier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Créer des jardiniers de test
        Jardinier::create([
            'NomJardinier' => 'Benali',
            'prenom' => 'Ahmed',
            'login' => 'abenali',
            'mdp' => Hash::make('password123'),
            'date_embauche' => '2020-03-15',
        ]);

        // Afficher les informations de test
        $this->command->info('Jardinier de test créé :');
        $this->command->info('Login: abenali, Password: password123');
    }
}
