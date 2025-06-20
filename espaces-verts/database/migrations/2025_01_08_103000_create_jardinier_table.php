<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('jardinier');
        Schema::create('jardinier', function (Blueprint $table) {
            $table->id('NumJardinier');
            $table->string('NomJardinier');
            $table->string('prenom');
            $table->date('date_embauche');
            $table->string('login')->unique();
            $table->string('mdp');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jardinier');
    }
};