<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PokemonController;
use App\Http\Controllers\MyPokemonController;
use App\Http\Controllers\HistoryController;

Route::get('/pokemon', [PokemonController::class, 'index']);
Route::get('/pokemon/{id}', [PokemonController::class, 'show']);
Route::get('/history', [HistoryController::class, 'index']);

Route::get('/my-pokemon', [MyPokemonController::class, 'index']);
Route::post('/my-pokemon', [MyPokemonController::class, 'store']);
Route::delete('/my-pokemon/{id}', [MyPokemonController::class, 'destroy']);