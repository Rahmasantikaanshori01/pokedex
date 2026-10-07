<?php

namespace App\Http\Controllers;

use App\Models\History;
use App\Models\MyPokemon;
use Illuminate\Http\Request;

class MyPokemonController extends Controller
{
    /**
     * Menampilkan semua Pokémon yang sudah ditangkap.
     */
    public function index()
    {
        $pokemon = MyPokemon::latest('caught_at')->get();

        return response()->json([
            'count' => $pokemon->count(),
            'data' => $pokemon,
        ]);
    }

    /**
     * Mencoba menangkap Pokémon.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pokemon_id' => ['required', 'integer', 'min:1'],
            'name' => ['required', 'string', 'max:255'],
            'image' => ['required', 'string'],
            'types' => ['required', 'array', 'min:1'],
            'height' => ['required', 'integer', 'min:0'],
            'weight' => ['required', 'integer', 'min:0'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | CEK APAKAH SUDAH DIMILIKI
        |--------------------------------------------------------------------------
        */

        $alreadyCaught = MyPokemon::where(
            'pokemon_id',
            $validated['pokemon_id']
        )->exists();

        if ($alreadyCaught) {
            return response()->json([
                'success' => false,
                'message' => 'Pokémon ini sudah ada di koleksi kamu.',
            ], 409);
        }

        /*
        |--------------------------------------------------------------------------
        | TENTUKAN HASIL CATCH
        |--------------------------------------------------------------------------
        |
        | Peluang berhasil: 50%
        |
        */

        $isCaught = random_int(1, 100) <= 50;

        if (!$isCaught) {
            return response()->json([
                'success' => false,
                'caught' => false,
                'message' => 'Pokémon berhasil melarikan diri!',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | SIMPAN POKÉMON
        |--------------------------------------------------------------------------
        */

        $pokemon = MyPokemon::create([
            'pokemon_id' => $validated['pokemon_id'],
            'name' => $validated['name'],
            'image' => $validated['image'],
            'types' => $validated['types'],
            'height' => $validated['height'],
            'weight' => $validated['weight'],
            'caught_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | SIMPAN HISTORY
        |--------------------------------------------------------------------------
        */

        History::create([
            'pokemon_id' => $pokemon->pokemon_id,
            'pokemon_name' => $pokemon->name,
            'activity' => 'catch',
        ]);

        return response()->json([
            'success' => true,
            'caught' => true,
            'message' => 'Pokémon berhasil ditangkap!',
            'data' => $pokemon,
        ], 201);
    }

    /**
     * Melepaskan Pokémon dari koleksi.
     */
    public function destroy(string $id)
    {
        $pokemon = MyPokemon::find($id);

        if (!$pokemon) {
            return response()->json([
                'success' => false,
                'message' => 'Pokémon tidak ditemukan di koleksi.',
            ], 404);
        }

        History::create([
            'pokemon_id' => $pokemon->pokemon_id,
            'pokemon_name' => $pokemon->name,
            'activity' => 'release',
        ]);

        $pokemon->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pokémon berhasil dilepaskan dari koleksi.',
        ]);
    }
}