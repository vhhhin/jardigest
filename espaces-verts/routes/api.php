<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JardinController;
use App\Http\Controllers\ContenuController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes d'authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Route CORS pour les requêtes OPTIONS
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');

// Routes pour les jardins
Route::get('/jardins', [JardinController::class, 'index']);

// Routes pour les contenus (plantes dans les jardins)
Route::get('/contenus', [ContenuController::class, 'index']);
Route::post('/contenus', [ContenuController::class, 'store'])->name('contenus.store');
Route::delete('/contenus/{id}', [ContenuController::class, 'destroy']);