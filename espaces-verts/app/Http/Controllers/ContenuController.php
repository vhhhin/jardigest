<?php

namespace App\Http\Controllers;

use App\Models\Contenu;
use App\Models\Plante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ContenuController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->has('jardin_id')) {
            return response()->json([
                'success' => false,
                'message' => 'jardin_id est requis'
            ], 400);
        }
        
        $contenus = DB::table('contenu')
            ->join('plante', 'contenu.plante', '=', 'plante.NumP')
            ->where('contenu.Jardin', $request->jardin_id)
            ->select(
                'contenu.idContenue as id',
                'plante.NomP as nom_plante',
                'plante.origine',
                'plante.prix',
                'contenu.quantité',
                'contenu.date_plantation'
            )
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $contenus,
            'count' => $contenus->count()
        ]);
    }
    
    public function store(Request $request)
    { $request->validate([
            'jardin_id' => 'required|integer|exists:jardin,NumJ',
            'plante_id' => 'required|integer|exists:plante,NumP',
            'quantite' => 'required|integer|min:1'
        ]);
        try {
            $contenu = new Contenu();
            $contenu->Jardin = $request->jardin_id;
            $contenu->plante = $request->plante_id;
            $contenu->quantité = $request->quantite;
            $contenu->date_plantation = Carbon::now();
            $contenu->save();
            return response()->json([
                'success' => true,
                'message' => 'Plante ajoutée au jardin avec succès',
                'data' => $contenu
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout de la plante',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function destroy($id)
    { try {
            $contenu = Contenu::find($id);
            if (!$contenu) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contenu non trouvé'
                ], 404);
            }
            $contenu->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Plante supprimée du jardin avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}