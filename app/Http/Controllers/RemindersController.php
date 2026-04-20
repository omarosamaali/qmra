<?php

namespace App\Http\Controllers;

use App\Models\Reminder;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RemindersController extends Controller
{
    private function userId(): int
    {
        return Auth::check() ? Auth::id() : 1;
    }

    private static function staticServices(): array
    {
        return [
            ['id' =>  1, 'nameAr' => 'تغيير زيت المحرك',     'nameEn' => 'Oil Change',          'icon' => '🛢️'],
            ['id' =>  2, 'nameAr' => 'فلتر الهواء',           'nameEn' => 'Air Filter',          'icon' => '💨'],
            ['id' =>  3, 'nameAr' => 'فلتر الوقود',           'nameEn' => 'Fuel Filter',         'icon' => '⛽'],
            ['id' =>  4, 'nameAr' => 'فلتر الكابينة',         'nameEn' => 'Cabin Filter',        'icon' => '🌬️'],
            ['id' =>  5, 'nameAr' => 'البواجي',               'nameEn' => 'Spark Plugs',         'icon' => '⚡'],
            ['id' =>  6, 'nameAr' => 'فحص الفرامل',           'nameEn' => 'Brake Inspection',   'icon' => '🛑'],
            ['id' =>  7, 'nameAr' => 'تبديل الإطارات',        'nameEn' => 'Tire Rotation',       'icon' => '🔄'],
            ['id' =>  8, 'nameAr' => 'ضبط الإطارات',          'nameEn' => 'Wheel Alignment',    'icon' => '🎯'],
            ['id' =>  9, 'nameAr' => 'موازنة الإطارات',       'nameEn' => 'Wheel Balancing',    'icon' => '⚖️'],
            ['id' => 10, 'nameAr' => 'سائل التبريد',          'nameEn' => 'Coolant Flush',       'icon' => '🌡️'],
            ['id' => 11, 'nameAr' => 'سائل الفرامل',          'nameEn' => 'Brake Fluid',         'icon' => '💧'],
            ['id' => 12, 'nameAr' => 'سائل ناقل الحركة',      'nameEn' => 'Transmission Fluid', 'icon' => '🔧'],
            ['id' => 13, 'nameAr' => 'بطارية السيارة',        'nameEn' => 'Battery Check',       'icon' => '🔋'],
            ['id' => 14, 'nameAr' => 'حزام التوقيت',          'nameEn' => 'Timing Belt',         'icon' => '⚙️'],
            ['id' => 15, 'nameAr' => 'حزام المروحة',          'nameEn' => 'Drive Belt',          'icon' => '🔗'],
            ['id' => 16, 'nameAr' => 'فحص التكييف',           'nameEn' => 'AC Service',          'icon' => '❄️'],
            ['id' => 17, 'nameAr' => 'شمعات التوهج',          'nameEn' => 'Glow Plugs',          'icon' => '🕯️'],
            ['id' => 18, 'nameAr' => 'فحص شامل',              'nameEn' => 'Full Inspection',    'icon' => '🔍'],
            ['id' => 19, 'nameAr' => 'تجديد مسح الزجاج',     'nameEn' => 'Wiper Blades',        'icon' => '🌧️'],
            ['id' => 20, 'nameAr' => 'فحص الإضاءة',           'nameEn' => 'Lights Check',        'icon' => '💡'],
        ];
    }

    public function index()
    {
        $userId = $this->userId();

        $vehicles = Vehicle::where('user_id', $userId)->get()->map(fn($v) => [
            'id'          => $v->id,
            'nameAr'      => $v->name_ar,
            'nameEn'      => $v->name_en,
            'brand'       => $v->brand,
            'type'        => $v->type,
            'plateNumber' => $v->plate_number,
            'color'       => $v->color,
        ]);

        $vehicleIds = $vehicles->pluck('id');
        $reminders  = Reminder::whereIn('vehicle_id', $vehicleIds)->get()->map(fn($r) => [
            'id'        => $r->id,
            'vehicleId' => $r->vehicle_id,
            'serviceId' => $r->service_id,
            'titleAr'   => $r->title_ar,
            'dueDate'   => $r->due_date?->toDateString(),
            'dueKm'     => $r->due_km,
            'completed' => $r->completed,
        ]);

        return Inertia::render('Phone/Reminders', [
            'vehicles'  => $vehicles,
            'services'  => self::staticServices(),
            'reminders' => $reminders,
        ]);
    }

    public function store(Request $request)
    {
        $userId = $this->userId();

        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'title_ar'   => 'required|string|max:255',
            'due_date'   => 'nullable|date',
            'due_km'     => 'nullable|integer|min:0',
        ]);

        Vehicle::where('id', $request->vehicle_id)->where('user_id', $userId)->firstOrFail();

        Reminder::create([
            'user_id'    => $userId,
            'vehicle_id' => $request->vehicle_id,
            'service_id' => $request->service_id ?: null,
            'title_ar'   => $request->title_ar,
            'due_date'   => $request->due_date ?: null,
            'due_km'     => $request->due_km ?: null,
            'completed'  => false,
        ]);

        return back();
    }

    public function update(Request $request, int $id)
    {
        $userId = $this->userId();
        $reminder = Reminder::findOrFail($id);
        Vehicle::where('id', $reminder->vehicle_id)->where('user_id', $userId)->firstOrFail();

        $request->validate([
            'title_ar' => 'sometimes|string|max:255',
            'due_date' => 'nullable|date',
            'due_km'   => 'nullable|integer|min:0',
            'completed'=> 'sometimes|boolean',
        ]);

        $reminder->update($request->only(['title_ar', 'due_date', 'due_km', 'completed', 'service_id']));

        return back();
    }

    public function destroy(int $id)
    {
        $userId = $this->userId();
        $reminder = Reminder::findOrFail($id);
        Vehicle::where('id', $reminder->vehicle_id)->where('user_id', $userId)->firstOrFail();
        $reminder->delete();

        return back();
    }

    public function complete(int $id)
    {
        $userId = $this->userId();
        $reminder = Reminder::findOrFail($id);
        Vehicle::where('id', $reminder->vehicle_id)->where('user_id', $userId)->firstOrFail();
        $reminder->update(['completed' => true]);

        return back();
    }
}
