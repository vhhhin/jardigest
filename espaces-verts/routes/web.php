<?php

use Illuminate\Support\Facades\Route;

// Route pour la page d'accueil - simple message JSON pour API
Route::get('/', function () {
    return response()->json([
        'message' => 'Laravel API is running. Use /api/ endpoints.',
        'status' => 'success'
    ], 200);
});

// Fallback pour les routes non trouvées
Route::fallback(function () {
    if (request()->wantsJson()) {
        return response()->json([
            'message' => 'Laravel API is running. Use /api/ endpoints.',
            'status' => 'success'
        ], 200);
    }
    
    return response()->json([
        'message' => 'Laravel API is running. Use /api/ endpoints.',
        'status' => 'success'
    ], 200);
});
