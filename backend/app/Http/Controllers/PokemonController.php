<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PokemonController extends Controller
{
    /**
     * Menampilkan daftar Pokémon dan fitur pencarian.
     */
    public function index(Request $request)
    {
        $search = strtolower(trim($request->query('search', '')));

        /*
        |--------------------------------------------------------------------------
        | SEARCH POKÉMON
        |--------------------------------------------------------------------------
        */

        if ($search !== '') {
            $response = Http::get('https://pokeapi.co/api/v2/pokemon', [
                'limit' => 2000,
                'offset' => 0,
            ]);

            if ($response->failed()) {
                return response()->json([
                    'message' => 'Gagal mengambil data Pokémon.',
                ], 500);
            }

            $data = $response->json();

            $results = collect($data['results'])
                ->filter(function ($pokemon) use ($search) {
                    return str_contains(
                        strtolower($pokemon['name']),
                        $search
                    );
                })
                ->values()
                ->map(function ($pokemon) {
                    $id = $this->getPokemonIdFromUrl($pokemon['url']);

                    return [
                        'id' => $id,
                        'name' => $pokemon['name'],
                        'image' => $this->getPokemonImage($id),
                    ];
                })
                ->all();

            return response()->json([
                'count' => count($results),
                'next' => null,
                'previous' => null,
                'has_more' => false,
                'results' => $results,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | DAFTAR POKÉMON NORMAL
        |--------------------------------------------------------------------------
        */

        $limit = min((int) $request->query('limit', 20), 100);
        $offset = max((int) $request->query('offset', 0), 0);

        $response = Http::get('https://pokeapi.co/api/v2/pokemon', [
            'limit' => $limit,
            'offset' => $offset,
        ]);

        if ($response->failed()) {
            return response()->json([
                'message' => 'Gagal mengambil data Pokémon.',
            ], 500);
        }

        $data = $response->json();

        $results = collect($data['results'])
            ->map(function ($pokemon) {
                $id = $this->getPokemonIdFromUrl($pokemon['url']);

                return [
                    'id' => $id,
                    'name' => $pokemon['name'],
                    'image' => $this->getPokemonImage($id),
                ];
            })
            ->all();

        return response()->json([
            'count' => $data['count'],
            'next' => $data['next'],
            'previous' => $data['previous'],
            'has_more' => ($offset + $limit) < (int) $data['count'],
            'results' => $results,
        ]);
    }

    /**
     * Menampilkan detail Pokémon berdasarkan ID atau nama.
     */
    public function show(string $id)
    {
        $response = Http::get(
            "https://pokeapi.co/api/v2/pokemon/{$id}"
        );

        if ($response->failed()) {
            return response()->json([
                'message' => 'Pokémon tidak ditemukan.',
            ], 404);
        }

        $pokemon = $response->json();

        return response()->json([
            'id' => $pokemon['id'],
            'name' => $pokemon['name'],

            'image' => $pokemon['sprites']['other']['official-artwork']['front_default']
                ?? $pokemon['sprites']['front_default'],

            'types' => collect($pokemon['types'])
                ->map(function ($type) {
                    return $type['type']['name'];
                })
                ->values()
                ->all(),

            'height' => $pokemon['height'],
            'weight' => $pokemon['weight'],

            'abilities' => collect($pokemon['abilities'])
                ->map(function ($ability) {
                    return $ability['ability']['name'];
                })
                ->values()
                ->all(),

            'stats' => collect($pokemon['stats'])
                ->mapWithKeys(function ($stat) {
                    return [
                        $stat['stat']['name'] => $stat['base_stat'],
                    ];
                })
                ->all(),
        ]);
    }

    /**
     * Mengambil ID Pokémon dari URL PokéAPI.
     */
    private function getPokemonIdFromUrl(string $url): int
    {
        $parts = explode('/', trim($url, '/'));

        return (int) end($parts);
    }

    /**
     * Membuat URL gambar Pokémon.
     */
    private function getPokemonImage(int $id): string
    {
        return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{$id}.png";
    }
}