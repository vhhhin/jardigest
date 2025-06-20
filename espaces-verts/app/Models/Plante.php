<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plante extends Model
{
    protected $table = 'plantes';
    protected $primaryKey = 'NumP';

    protected $fillable = ['NomP', 'origine', 'prix'];

    public function contenus()
    {
        return $this->hasMany(Contenu::class, 'plante', 'NumP');
    }
}
