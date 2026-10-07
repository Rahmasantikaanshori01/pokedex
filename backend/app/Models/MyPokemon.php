<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MyPokemon extends Model
{
    protected $table = 'my_pokemon';

    protected $fillable = [
        'pokemon_id',
        'name',
        'image',
        'types',
        'height',
        'weight',
        'caught_at',
    ];

    protected $casts = [
        'types' => 'array',
        'caught_at' => 'datetime',
    ];
}