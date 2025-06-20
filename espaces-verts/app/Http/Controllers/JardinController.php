<?php
namespace App\Http\Controllers;
use App\Models\Jardin;
use App\Models\Contenu;
use App\Models\Plante;
use Illuminate\Http\Request;
class JardinController extends Controller
{ public function index(Request $request)
    {
        // Vérifier si le jardinier est connecté
        if (!session('jardinier')) {
            return redirect()->route('auth.login');
        }
        $query = Jardin::where('Jardinier', session('jardinier.id'));
        // Filtrer par ville si spécifiée
        if ($request->has('ville') && $request->ville) {
            $query->where('ville', 'like', '%' . $request->ville . '%');
        }
        $jardins = $query->get();
        return view('jardins.index', compact('jardins')); }
    public function show($id)
    { // Vérifier si le jardinier est connecté
        if (!session('jardinier')) {
            return redirect()->route('auth.login');
        }
        $jardin = Jardin::where('NumJ', $id)
                       ->where('Jardinier', session('jardinier.id'))
                       ->firstOrFail();
        $contenus = Contenu::with('plante')
                          ->where('Jardin', $id)
                          ->get();

        $plantes = Plante::all();
        return view('jardins.show', compact('jardin', 'contenus', 'plantes'));
    }
    public function create()
    {
        if (!session('jardinier')) {
            return redirect()->route('auth.login'); }
        return view('jardins.create'); }
    public function store(Request $request)
    {
        if (!session('jardinier')) {
            return redirect()->route('auth.login');
        }
        $request->validate([
            'nomJardin' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'superficie' => 'required|numeric|min:1'
        ]);
        Jardin::create([
            'nomJardin' => $request->nomJardin,
            'adresse' => $request->adresse,
            'ville' => $request->ville,
            'superficie' => $request->superficie,
            'Jardinier' => session('jardinier.id')
        ]);

        return redirect()->route('jardins.index')
                        ->with('success', 'Jardin créé avec succès!');
    }

    public function destroy($id)
    {
        if (!session('jardinier')) {
            return redirect()->route('auth.login');
        }

        $jardin = Jardin::where('NumJ', $id)
                       ->where('Jardinier', session('jardinier.id'))
                       ->firstOrFail();

        $jardin->delete();

        return redirect()->route('jardins.index')
                        ->with('success', 'Jardin supprimé avec succès!');
    }
}