import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { vehicles, services } from "../../data/mockData";

// Services that require current km reading
const KM_REQUIRED_SERVICES = [1, 3, 4]; // Oil Change, Tires, Brakes

// ─── Icons ────────────────────────────────────────────────────────────────────

const BackIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
);

const CarIcon = ({ color = "#666", className = "" }) => (
    <svg className={className} viewBox="0 0 24 24" fill={color}>
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);

const SuvIcon = ({ color = "#666", className = "" }) => (
    <svg className={className} viewBox="0 0 24 24" fill={color}>
        <path d="M20 8h-3L14 4H5C3.9 4 3 4.9 3 6v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM8 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12-3h-1.73c-.41-.59-1.07-1-1.77-1s-1.36.41-1.77 1H10.5c-.41-.59-1.07-1-1.77-1s-1.36.41-1.77 1H5V6h8.5l3 4H20v5zm-4 3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
);

// ─── Step Indicator ───────────────────────────────────────────────────────────

const steps = ["المركبة", "الخدمة", "التكرار", "التكلفة"];

const StepIndicator = ({ current }) => (
    <div className="flex items-center justify-center gap-1.5 mb-6">
        {steps.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
                <div key={i} className="flex items-center gap-1.5">
                    <div className="flex flex-col items-center gap-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            done ? "bg-[#800000] text-white" :
                            active ? "bg-[#800000] text-white ring-4 ring-[#800000]/20" :
                            "bg-gray-200 text-gray-400"
                        }`}>
                            {done ? <CheckIcon /> : i + 1}
                        </div>
                        <span className={`text-xs ${active ? "text-[#800000] font-semibold" : "text-gray-400"}`}>
                            {label}
                        </span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mb-4 rounded-full ${i < current ? "bg-[#800000]" : "bg-gray-200"}`} />
                    )}
                </div>
            );
        })}
    </div>
);

// ─── Step 1 — Vehicle ─────────────────────────────────────────────────────────

const StepVehicle = ({ value, onChange }) => (
    <div className="space-y-3">
        <h2 className="font-bold text-gray-900 text-lg mb-4">اختر المركبة</h2>
        {vehicles.map((v) => {
            const VIcon = v.type === "suv" ? SuvIcon : CarIcon;
            const selected = value === v.id;
            return (
                <button
                    key={v.id}
                    onClick={() => onChange(v.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-150 ${
                        selected ? "bg-[#800000]/10 ring-2 ring-[#800000]" : "bg-white shadow-sm active:opacity-80"
                    }`}
                >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: v.color + "20" }}>
                        <VIcon color={v.color} className="w-6 h-6" />
                    </div>
                    <div className="text-right flex-1">
                        <p className="font-bold text-gray-900 text-sm">{v.nameAr}</p>
                        <p className="text-xs text-gray-400">{v.brand} &bull; {v.plateNumber}</p>
                    </div>
                    {selected && (
                        <div className="w-6 h-6 rounded-full bg-[#800000] flex items-center justify-center shrink-0">
                            <CheckIcon />
                        </div>
                    )}
                </button>
            );
        })}
    </div>
);

// ─── Step 2 — Service ─────────────────────────────────────────────────────────

const StepService = ({ serviceId, currentKm, onChange }) => {
    const needsKm = serviceId && KM_REQUIRED_SERVICES.includes(serviceId);

    return (
        <div className="space-y-4">
            <h2 className="font-bold text-gray-900 text-lg mb-4">اختر الخدمة</h2>

            <div className="grid grid-cols-2 gap-2.5">
                {services.map((s) => {
                    const selected = serviceId === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => onChange("serviceId", s.id)}
                            className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl transition-all duration-150 ${
                                selected ? "bg-[#800000]/10 ring-2 ring-[#800000]" : "bg-white shadow-sm active:opacity-80"
                            }`}
                        >
                            <span className="text-2xl leading-none">{s.icon}</span>
                            <span className={`text-xs font-semibold ${selected ? "text-[#800000]" : "text-gray-700"}`}>
                                {s.nameAr}
                            </span>
                        </button>
                    );
                })}
            </div>

            {needsKm && (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        عداد الكيلومتر الحالي
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={currentKm}
                            onChange={(e) => onChange("currentKm", e.target.value)}
                            placeholder="مثال: 85000"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] placeholder:text-gray-400"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">كم</span>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Step 3 — Recurrence + Reminder ──────────────────────────────────────────

const StepRecurrence = ({ form, onChange }) => {
    const needsKm = form.serviceId && KM_REQUIRED_SERVICES.includes(form.serviceId);

    const calcReminderDate = () => {
        if (!form.intervalDays) return null;
        const base = form.lastServiceDate ? new Date(form.lastServiceDate) : new Date();
        const d = new Date(base);
        d.setDate(d.getDate() + Number(form.intervalDays));
        return d.toISOString().split("T")[0];
    };

    const calcReminderKm = () => {
        if (!form.intervalKm || !form.currentKm) return null;
        return Number(form.currentKm) + Number(form.intervalKm);
    };

    const reminderDate = calcReminderDate();
    const reminderKm = calcReminderKm();

    return (
        <div className="space-y-4">
            <h2 className="font-bold text-gray-900 text-lg mb-4">التكرار والتذكير</h2>

            {/* Last service date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    تاريخ آخر خدمة
                </label>
                <input
                    type="date"
                    value={form.lastServiceDate}
                    onChange={(e) => onChange("lastServiceDate", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000]"
                />
            </div>

            {/* Interval by days */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    التكرار بالأيام
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                    {[30, 60, 90, 180].map((d) => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => onChange("intervalDays", String(d))}
                            className={`py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                                form.intervalDays === String(d)
                                    ? "bg-[#800000] text-white"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {d} يوم
                        </button>
                    ))}
                </div>
                <input
                    type="number"
                    value={form.intervalDays}
                    onChange={(e) => onChange("intervalDays", e.target.value)}
                    placeholder="أو أدخل عدد الأيام"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] placeholder:text-gray-400"
                />
            </div>

            {/* Interval by km */}
            {needsKm && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        التكرار بالكيلومتر
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        {[5000, 7500, 10000, 15000].map((k) => (
                            <button
                                key={k}
                                type="button"
                                onClick={() => onChange("intervalKm", String(k))}
                                className={`py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                                    form.intervalKm === String(k)
                                        ? "bg-[#800000] text-white"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {k.toLocaleString("en")}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={form.intervalKm}
                            onChange={(e) => onChange("intervalKm", e.target.value)}
                            placeholder="أو أدخل عدد الكيلومترات"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] placeholder:text-gray-400"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">كم</span>
                    </div>
                </div>
            )}

            {/* Auto reminder preview */}
            {(reminderDate || reminderKm) && (
                <div className="bg-[#800000]/8 rounded-2xl p-4 space-y-2">
                    <p className="text-xs font-bold text-[#800000] mb-1">التذكير التلقائي</p>
                    {reminderDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="text-base">📅</span>
                            <span>{new Date(reminderDate).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}</span>
                        </div>
                    )}
                    {reminderKm && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="text-base">🛣️</span>
                            <span>عند {reminderKm.toLocaleString("en")} كم</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Step 4 — Cost ────────────────────────────────────────────────────────────

const StepCost = ({ form, onChange }) => (
    <div className="space-y-4">
        <h2 className="font-bold text-gray-900 text-lg mb-4">التكلفة والتفاصيل</h2>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                التكلفة (AED)
            </label>
            <div className="relative">
                <input
                    type="number"
                    value={form.cost}
                    onChange={(e) => onChange("cost", e.target.value)}
                    placeholder="0"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] placeholder:text-gray-400"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">AED</span>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                مزود الخدمة
            </label>
            <input
                type="text"
                value={form.provider}
                onChange={(e) => onChange("provider", e.target.value)}
                placeholder="مثال: Toyota Abu Dhabi"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] placeholder:text-gray-400"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ملاحظات
            </label>
            <textarea
                value={form.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                placeholder="أي ملاحظات إضافية..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] placeholder:text-gray-400 resize-none"
            />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-gray-500 mb-2">ملخص</p>
            <SummaryRow label="المركبة" value={vehicles.find((v) => v.id === form.vehicleId)?.nameAr} />
            <SummaryRow label="الخدمة" value={services.find((s) => s.id === form.serviceId)?.nameAr} />
            {form.intervalDays && <SummaryRow label="التكرار" value={`كل ${form.intervalDays} يوم`} />}
            {form.intervalKm && <SummaryRow label="الكيلومتر" value={`كل ${Number(form.intervalKm).toLocaleString("en")} كم`} />}
            {form.cost && <SummaryRow label="التكلفة" value={`${Number(form.cost).toLocaleString("en")} AED`} />}
        </div>
    </div>
);

const SummaryRow = ({ label, value }) =>
    value ? (
        <div className="flex justify-between text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="font-semibold text-gray-800">{value}</span>
        </div>
    ) : null;

// ─── Main Component ───────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

export default function AddService() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        vehicleId: null,
        serviceId: null,
        currentKm: "",
        lastServiceDate: new Date().toISOString().split("T")[0],
        intervalDays: "",
        intervalKm: "",
        cost: "",
        provider: "",
        notes: "",
    });

    const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const canNext = () => {
        if (step === 0) return form.vehicleId !== null;
        if (step === 1) return form.serviceId !== null;
        if (step === 2) return form.intervalDays || form.intervalKm;
        return true;
    };

    const handleSubmit = () => {
        // In a real app: POST to backend
        router.get("/");
    };

    return (
        <>
            <Head title="إضافة خدمة - قمرة" />
            <div className="min-h-screen bg-gray-100 flex justify-center" dir="rtl">
                <div className="w-full max-w-sm min-h-screen flex flex-col bg-gray-100">

                    {/* Header */}
                    <div className="bg-white flex items-center gap-3 sticky top-0 z-20 shadow-sm">
                        <button
                            onClick={() => step === 0 ? router.get("/") : setStep((s) => s - 1)}
                            className="w-9 h-17 flex items-center justify-center bg-[#800000] text-white active:opacity-80 transition-opacity"
                        >
                            <BackIcon />
                        </button>
                        <h1 className="font-bold text-gray-900 text-lg">إضافة خدمة</h1>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="px-4 pt-5 pb-32">
                            <StepIndicator current={step} />

                            {step === 0 && (
                                <StepVehicle value={form.vehicleId} onChange={(id) => update("vehicleId", id)} />
                            )}
                            {step === 1 && (
                                <StepService
                                    serviceId={form.serviceId}
                                    currentKm={form.currentKm}
                                    onChange={update}
                                />
                            )}
                            {step === 2 && (
                                <StepRecurrence form={form} onChange={update} />
                            )}
                            {step === 3 && (
                                <StepCost form={form} onChange={update} />
                            )}
                        </div>
                    </div>

                    {/* Bottom button */}
                    <div className="fixed bottom-0 right-0 left-0 flex justify-center pointer-events-none">
                        <div className="w-full max-w-sm px-4 pb-8 pointer-events-auto">
                            <button
                                onClick={() => step < TOTAL_STEPS - 1 ? setStep((s) => s + 1) : handleSubmit()}
                                disabled={!canNext()}
                                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-150 shadow-lg ${
                                    canNext()
                                        ? "bg-[#800000] text-white active:opacity-90"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {step < TOTAL_STEPS - 1 ? "التالي" : "حفظ الخدمة"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
