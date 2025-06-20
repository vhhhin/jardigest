<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */    public function up(): void
    {
        Schema::dropIfExists('contenus');
        Schema::create('contenus', function (Blueprint $table) {
            $table->id('idContenue');
            $table->unsignedBigInteger('Jardin');
            $table->unsignedBigInteger('plante');
            $table->integer('quantite');
            $table->date('date_plantation');
            $table->timestamps();

            $table->foreign('Jardin')->references('NumJ')->on('jardins')->onDelete('cascade');
            $table->foreign('plante')->references('NumP')->on('plantes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contenus');
    }
};