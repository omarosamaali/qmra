<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\Reminder;
use App\Models\Service;
use App\Models\Vehicle;
use App\Models\VehicleService;
use App\Models\Warranty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // For now use user id=1 (demo). Replace with Auth::id() once auth middleware is applied.
        $userId = Auth::check() ? Auth::id() : 1;

        $vehicles = Vehicle::where('user_id', $userId)->get()
            ->map(fn($v) => [
                'id'          => $v->id,
                'nameAr'      => $v->name_ar,
                'nameEn'      => $v->name_en,
                'brand'       => $v->brand,
                'type'        => $v->type,
                'plateNumber' => $v->plate_number,
                'km'          => $v->km,
                'color'       => $v->color,
                'year'        => $v->year,
                'image'       => $v->image,
                'isLinked'    => (bool) $v->is_linked,
                'linkCode'    => $v->link_code,
            ]);

        $services = Service::all()->map(fn($s) => [
            'id'     => $s->id,
            'nameAr' => $s->name_ar,
            'nameEn' => $s->name_en,
            'icon'   => $s->icon,
        ]);

        $reminders = Reminder::where('user_id', $userId)->get()->map(fn($r) => [
            'id'        => $r->id,
            'vehicleId' => $r->vehicle_id,
            'serviceId' => $r->service_id,
            'titleAr'   => $r->title_ar,
            'dueDate'   => $r->due_date?->toDateString(),
            'dueKm'     => $r->due_km,
            'completed' => $r->completed,
        ]);

        $records = Record::where('user_id', $userId)
            ->orderByDesc('date')
            ->get()
            ->map(fn($r) => [
                'id'        => $r->id,
                'vehicleId' => $r->vehicle_id,
                'serviceId' => $r->service_id,
                'date'      => $r->date->toDateString(),
                'km'        => $r->km,
                'cost'      => $r->cost,
                'notes'     => $r->notes,
                'provider'  => $r->provider,
            ]);

        $warranties = Warranty::where('user_id', $userId)->get()->map(fn($w) => [
            'id'         => $w->id,
            'vehicleId'  => $w->vehicle_id,
            'titleAr'    => $w->title_ar,
            'titleEn'    => $w->title_en,
            'icon'       => $w->icon,
            'expiryDate' => $w->expiry_date->toDateString(),
            'provider'   => $w->provider,
            'notes'      => $w->notes,
        ]);

        $vehicleIds = $vehicles->pluck('id');
        $vehicleServicesCount = VehicleService::whereIn('vehicle_id', $vehicleIds)->count();

        $subscription = request()->session()->get('subscription', [
            'cars_count'   => 1,
            'addons_count' => 0,
        ]);

        return Inertia::render('Home', compact('vehicles','services','reminders','records','warranties','vehicleServicesCount','subscription'));
    }
}
