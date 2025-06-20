<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contenu extends Model
{
    protected $table = 'contenus';
    protected $primaryKey = 'idContenue';

    protected $fillable = ['Jardin', 'plante', 'quantite', 'date_plantation'];

    protected $casts = [
        'date_plantation' => 'date',
    ];

    public function jardin()
    {
        return $this->belongsTo(Jardin::class, 'Jardin', 'NumJ');
    }

    public function plante()
    {
        return $this->belongsTo(Plante::class, 'plante', 'NumP');
    }
}
