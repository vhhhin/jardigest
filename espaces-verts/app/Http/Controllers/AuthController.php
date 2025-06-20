<?php

namespace App\Http\Controllers;

use App\Models\Jardinier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{    // POST /api/login    public function login(Request $request)
    {
        // Add CORS headers
        $response = response();
        $response->header('Access-Control-Allow-Origin', '*');
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        
        // Log des données reçues pour débogage
        \Log::info('Login attempt:', $request->all());
        
        $validator = Validator::make($request->all(), [
            'login' => 'required|string',
            'mdp' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 400)->header('Access-Control-Allow-Origin', '*');
        }

        $jardinier = Jardinier::where('login', $request->login)->first();
        
        \Log::info('Jardinier found:', $jardinier ? $jardinier->toArray() : ['not found']);

        if (!$jardinier || !Hash::check($request->mdp, $jardinier->mdp)) {
            \Log::info('Login failed for user: ' . $request->login);
            return response()->json([
                'success' => false,
                'message' => 'Login ou mot de passe incorrect'
            ], 401)->header('Access-Control-Allow-Origin', '*');
        }

        \Log::info('Login successful for user: ' . $request->login);
        
        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'jardinier' => [
                'id' => $jardinier->NumJardinier,
                'nom' => $jardinier->NomJardinier,
                'prenom' => $jardinier->prenom
            ]
        ])->header('Access-Control-Allow-Origin', '*');
    }// POST /api/register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'login' => 'required|string|max:255|unique:jardinier,login',
            'mdp' => 'required|string|min:6',
            'date_embauche' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 400)->header('Access-Control-Allow-Origin', '*');
        }

        try {
            $jardinier = new Jardinier();
            $jardinier->NomJardinier = $request->nom;
            $jardinier->prenom = $request->prenom;
            $jardinier->login = $request->login;
            $jardinier->mdp = Hash::make($request->mdp);
            $jardinier->date_embauche = $request->date_embauche;
            $jardinier->save();

            return response()->json([
                'success' => true,
                'message' => 'Jardinier créé avec succès',
                'jardinier' => [
                    'id' => $jardinier->NumJardinier,
                    'nom' => $jardinier->NomJardinier,
                    'prenom' => $jardinier->prenom
                ]
            ], 201)->header('Access-Control-Allow-Origin', '*');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du jardinier',
                'error' => $e->getMessage()
            ], 500)->header('Access-Control-Allow-Origin', '*');
        }
    }

    public function logout()
    {
        session()->forget('jardinier');
        return redirect()->route('auth.login')->with('success', 'Vous avez été déconnecté');
    }

    public function showLogin()
    {
        if (session('jardinier')) {
            return redirect()->route('jardins.index');
        }
        return view('auth.login');
    }

    public function showRegister()
    {
        if (session('jardinier')) {
            return redirect()->route('jardins.index');
        }
        return view('auth.register');
    }
}