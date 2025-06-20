<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jardin extends Model
{
    protected $table = 'jardins';
    protected $primaryKey = 'NumJ';

    protected $fillable = ['nomJardin', 'adresse', 'ville', 'superficie', 'Jardinier'];

    public function contenus() {
        return $this->hasMany(Contenu::class, 'Jardin', 'NumJ');
    }

    public function jardinier() {
        return $this->belongsTo(Jardinier::class, 'Jardinier', 'NumJardinier');
    }
}
