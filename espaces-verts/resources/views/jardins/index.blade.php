@extends('layouts.app')

@section('title', 'Mes Jardins')

@section('content')
<div class="row">
    <div class="col-md-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1><i class="fas fa-leaf text-success"></i> Mes Jardins</h1>
            <a href="{{ route('jardins.create') }}" class="btn btn-success">
                <i class="fas fa-plus"></i> Nouveau Jardin
            </a>
        </div>

        <!-- Filtre par ville -->
        <div class="row mb-4">
            <div class="col-md-4">
                <form method="GET" action="{{ route('jardins.index') }}">
                    <div class="input-group">
                        <input type="text" class="form-control" name="ville" 
                               placeholder="Filtrer par ville..." 
                               value="{{ request('ville') }}">
                        <button class="btn btn-outline-secondary" type="submit">
                            <i class="fas fa-search"></i>
                        </button>
                        @if(request('ville'))
                            <a href="{{ route('jardins.index') }}" class="btn btn-outline-danger">
                                <i class="fas fa-times"></i>
                            </a>
                        @endif
                    </div>
                </form>
            </div>
        </div>

        <!-- Liste des jardins -->
        @if($jardins->count() > 0)
            <div class="row">
                @foreach($jardins as $jardin)
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-header bg-success text-white">
                                <h5 class="card-title mb-0">
                                    <i class="fas fa-tree"></i> {{ $jardin->nomJardin }}
                                </h5>
                            </div>
                            <div class="card-body">
                                <p class="card-text">
                                    <i class="fas fa-map-marker-alt text-danger"></i> 
                                    <strong>Adresse:</strong><br>
                                    {{ $jardin->adresse }}<br>
                                    {{ $jardin->ville }}
                                </p>
                                <p class="card-text">
                                    <i class="fas fa-ruler-combined text-info"></i> 
                                    <strong>Superficie:</strong> {{ $jardin->superficie }} m²
                                </p>
                            </div>
                            <div class="card-footer bg-light">
                                <div class="btn-group w-100" role="group">
                                    <a href="{{ route('jardins.show', $jardin->NumJ) }}" 
                                       class="btn btn-primary btn-sm">
                                        <i class="fas fa-eye"></i> Voir
                                    </a>
                                    <a href="{{ route('jardins.edit', $jardin->NumJ) }}" 
                                       class="btn btn-warning btn-sm">
                                        <i class="fas fa-edit"></i> Modifier
                                    </a>
                                    <form method="POST" action="{{ route('jardins.destroy', $jardin->NumJ) }}" 
                                          class="d-inline" onsubmit="return confirm('Êtes-vous sûr ?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-sm">
                                            <i class="fas fa-trash"></i> Supprimer
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div class="text-center py-5">
                <i class="fas fa-seedling fa-4x text-muted mb-3"></i>
                <h3 class="text-muted">Aucun jardin trouvé</h3>
                <p class="text-muted">Commencez par créer votre premier jardin!</p>
                <a href="{{ route('jardins.create') }}" class="btn btn-success">
                    <i class="fas fa-plus"></i> Créer un jardin
                </a>
            </div>
        @endif
    </div>
</div>
@endsection