<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Jardinier extends Model
{
    protected $table = 'jardinier';
    protected $primaryKey = 'NumJardinier';

    protected $fillable = [
        'NomJardinier',
        'prenom',
        'date_embauche',
        'login',
        'mdp'
    ];

    protected $hidden = [
        'mdp'
    ];

    protected $casts = [
        'date_embauche' => 'date',
    ];

    public function jardins()
    {
        return $this->hasMany(Jardin::class, 'Jardinier', 'NumJardinier');
    }

    // Ne pas hacher automatiquement le mot de passe - le contrôleur s'en charge
}
