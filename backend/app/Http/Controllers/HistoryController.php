<?php

namespace App\Http\Controllers;

use App\Models\History;

class HistoryController extends Controller
{
    /**
     * Menampilkan seluruh riwayat aktivitas Pokémon.
     */
    public function index()
    {
        $history = History::latest()->get();

        return response()->json([
            'count' => $history->count(),
            'data' => $history,
        ]);
    }
}