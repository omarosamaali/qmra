<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = ['user_id','name_ar','name_en','brand','type','plate_number','km','color','year','image','is_linked','link_code'];

    protected $casts = ['is_linked' => 'boolean'];

    public function reminders() { return $this->hasMany(Reminder::class); }
    public function records()   { return $this->hasMany(Record::class); }
    public function warranties(){ return $this->hasMany(Warranty::class); }
}
