<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('my_pokemon', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('pokemon_id');
            $table->string('name');
            $table->text('image');
            $table->json('types');

            $table->unsignedInteger('height');
            $table->unsignedInteger('weight');

            $table->timestamp('caught_at');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('my_pokemon');
    }
};