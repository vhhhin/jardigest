@extends('layouts.app')

@section('title', $jardin->nomJardin . ' - Gestion des Plantes')

@section('content')
<div class="row">
    <!-- En-tête du jardin -->
    <div class="col-md-12 mb-4">
        <div class="card bg-success text-white">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h1><i class="fas fa-tree"></i> {{ $jardin->nomJardin }}</h1>
                        <p class="mb-0">
                            <i class="fas fa-map-marker-alt"></i> {{ $jardin->adresse }}, {{ $jardin->ville }}
                            <span class="ms-3">
                                <i class="fas fa-ruler-combined"></i> {{ $jardin->superficie }} m²
                            </span>
                        </p>
                    </div>
                    <div>
                        <a href="{{ route('jardins.index') }}" class="btn btn-light">
                            <i class="fas fa-arrow-left"></i> Retour aux jardins
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Section ajout de plante -->
    <div class="col-md-4 mb-4">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h5><i class="fas fa-plus-circle"></i> Ajouter une Plante</h5>
            </div>
            <div class="card-body">
                <form id="addPlanteForm">
                    <div class="mb-3">
                        <label for="plante_id" class="form-label">Plante</label>
                        <select class="form-select" id="plante_id" required>
                            <option value="">Choisir une plante...</option>
                            @foreach($plantes as $plante)
                                <option value="{{ $plante->NumP }}" data-prix="{{ $plante->prix }}">
                                    {{ $plante->NomP }} ({{ $plante->origine }}) - {{ $plante->prix }}€
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="quantite" class="form-label">Quantité</label>
                        <input type="number" class="form-control" id="quantite" min="1" value="1" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">
                        <i class="fas fa-plus"></i> Ajouter la Plante
                    </button>
                </form>
            </div>
        </div>

        <!-- Statistiques -->
        <div class="card mt-3">
            <div class="card-header bg-info text-white">
                <h6><i class="fas fa-chart-bar"></i> Statistiques</h6>
            </div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-6">
                        <h4 class="text-success" id="totalPlantes">{{ $contenus->count() }}</h4>
                        <small>Espèces</small>
                    </div>
                    <div class="col-6">
                        <h4 class="text-primary" id="totalQuantite">{{ $contenus->sum('quantité') }}</h4>
                        <small>Total plants</small>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Liste des plantes du jardin -->
    <div class="col-md-8">
        <div class="card">
            <div class="card-header bg-success text-white">
                <h5><i class="fas fa-list"></i> Plantes du Jardin</h5>
            </div>
            <div class="card-body">
                <div id="plantesContainer">
                    @if($contenus->count() > 0)
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th><i class="fas fa-seedling"></i> Plante</th>
                                        <th><i class="fas fa-globe"></i> Origine</th>
                                        <th><i class="fas fa-calculator"></i> Quantité</th>
                                        <th><i class="fas fa-euro-sign"></i> Prix unitaire</th>
                                        <th><i class="fas fa-calendar"></i> Plantation</th>
                                        <th><i class="fas fa-cogs"></i> Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="plantesTableBody">
                                    @foreach($contenus as $contenu)
                                        <tr data-contenu-id="{{ $contenu->idContenue }}">
                                            <td>
                                                <strong>{{ $contenu->plante->NomP }}</strong>
                                            </td>
                                            <td>
                                                <span class="badge bg-secondary">{{ $contenu->plante->origine }}</span>
                                            </td>
                                            <td>
                                                <span class="badge bg-primary">{{ $contenu->quantité }}</span>
                                            </td>
                                            <td>{{ $contenu->plante->prix }}€</td>
                                            <td>{{ \Carbon\Carbon::parse($contenu->date_plantation)->format('d/m/Y') }}</td>
                                            <td>
                                                <button type="button" class="btn btn-danger btn-sm" 
                                                        onclick="supprimerPlante({{ $contenu->idContenue }})">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @else
                        <div class="text-center py-4" id="emptyState">
                            <i class="fas fa-seedling fa-4x text-muted mb-3"></i>
                            <h5 class="text-muted">Aucune plante dans ce jardin</h5>
                            <p class="text-muted">Ajoutez votre première plante en utilisant le formulaire ci-contre.</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
$(document).ready(function() {
    // Configuration CSRF
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Soumission du formulaire d'ajout
    $('#addPlanteForm').on('submit', function(e) {
        e.preventDefault();
        
        const planteId = $('#plante_id').val();
        const quantite = $('#quantite').val();
        
        if (!planteId || !quantite) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        $.ajax({
            url: '{{ route("contenus.store") }}',
            method: 'POST',
            data: {
                jardin_id: {{ $jardin->NumJ }},
                plante_id: planteId,
                quantite: quantite
            },
            success: function(response) {
                if (response.success) {
                    // Rafraîchir la page pour voir les nouveaux contenus
                    location.reload();
                } else {
                    alert('Erreur: ' + response.message);
                }
            },
            error: function(xhr) {
                alert('Erreur lors de l\'ajout de la plante');
                console.error(xhr.responseText);
            }
        });
    });
});

function supprimerPlante(contenuId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette plante du jardin ?')) {
        $.ajax({
            url: `/api/contenus/${contenuId}`,
            method: 'DELETE',
            success: function(response) {
                if (response.success) {
                    // Supprimer la ligne du tableau
                    $(`tr[data-contenu-id="${contenuId}"]`).fadeOut(300, function() {
                        $(this).remove();
                        
                        // Vérifier s'il reste des plantes
                        if ($('#plantesTableBody tr').length === 0) {
                            location.reload();
                        } else {
                            // Mettre à jour les statistiques
                            updateStats();
                        }
                    });
                } else {
                    alert('Erreur: ' + response.message);
                }
            },
            error: function(xhr) {
                alert('Erreur lors de la suppression');
                console.error(xhr.responseText);
            }
        });
    }
}

function updateStats() {
    const totalPlantes = $('#plantesTableBody tr').length;
    let totalQuantite = 0;
    
    $('#plantesTableBody tr').each(function() {
        const quantite = parseInt($(this).find('.badge.bg-primary').text());
        totalQuantite += quantite;
    });
    
    $('#totalPlantes').text(totalPlantes);
    $('#totalQuantite').text(totalQuantite);
}
</script>
@endsection