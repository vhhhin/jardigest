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
        Schema::dropIfExists('jardins');
        Schema::create('jardins', function (Blueprint $table) {
            $table->id('NumJ');
            $table->string('nomJardin');
            $table->string('adresse');
            $table->string('ville');
            $table->decimal('superficie', 10, 2);
            $table->unsignedBigInteger('Jardinier');
            $table->timestamps();

            $table->foreign('Jardinier')->references('NumJardinier')->on('jardinier')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jardins');
    }
};
