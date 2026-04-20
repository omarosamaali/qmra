import { useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { useState } from "react";

const T = {
    ar: {
        title:           "إنشاء حساب - قمرة",
        subtitle:        "أنشئ حسابك الآن",
        name:            "الاسم الكامل",
        email:           "البريد الإلكتروني",
        phone:           "رقم الجوال",
        password:        "كلمة المرور",
        confirmPassword: "تأكيد كلمة المرور",
        submit:          "إنشاء الحساب",
        loading:         "جارٍ الإنشاء...",
        hasAccount:      "لديك حساب بالفعل؟",
        login:           "تسجيل الدخول",
        passwordHint:    "8 أحرف على الأقل",
    },
    en: {
        title:           "Create Account - Qumra",
        subtitle:        "Create your account now",
        name:            "Full Name",
        email:           "Email Address",
        phone:           "Phone Number",
        password:        "Password",
        confirmPassword: "Confirm Password",
        submit:          "Create Account",
        loading:         "Creating account...",
        hasAccount:      "Already have an account?",
        login:           "Sign In",
        passwordHint:    "At least 8 characters",
    },
};

export default function Register() {
    const [lang, setLang] = useState("ar");
    const t = T[lang];
    const isAr = lang === "ar";

    const { data, setData, post, processing, errors } = useForm({
        name:                  "",
        email:                 "",
        password:              "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register");
    };

    const fields = [
        {
            key:         "name",
            label:       t.name,
            type:        "text",
            placeholder: isAr ? "محمد العلي" : "John Smith",
            autoComplete:"name",
        },
        {
            key:         "email",
            label:       t.email,
            type:        "email",
            placeholder: "example@email.com",
            autoComplete:"email",
        },
        {
            key:         "password",
            label:       t.password,
            type:        "password",
            placeholder: "••••••••",
            hint:        t.passwordHint,
            autoComplete:"new-password",
        },
        {
            key:         "password_confirmation",
            label:       t.confirmPassword,
            type:        "password",
            placeholder: "••••••••",
            autoComplete:"new-password",
        },
    ];

    return (
        <>
            <Head title={t.title} />
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10" dir={isAr ? "rtl" : "ltr"}>
                <div className="w-full max-w-sm">

                    {/* Language toggle */}
                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            onClick={() => setLang(isAr ? "en" : "ar")}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white transition-colors"
                        >
                            {isAr ? "English" : "عربي"}
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <img src="/images/dark-logo.png" alt="قمرة" className="h-20 object-contain mb-3" />
                        <p className="text-gray-500 text-sm">{t.subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(f => (
                            <div key={f.key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-center">
                                    {f.label}
                                </label>
                                <input
                                    type={f.type}
                                    value={data[f.key]}
                                    onChange={e => setData(f.key, e.target.value)}
                                    placeholder={f.placeholder}
                                    autoComplete={f.autoComplete}
                                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent placeholder:text-gray-400 ${
                                        errors[f.key] ? "border-red-400 bg-red-50" : "border-gray-200"
                                    }`}
                                    required
                                />
                                {f.hint && !errors[f.key] && (
                                    <p className="text-gray-400 text-xs mt-1 text-center">{f.hint}</p>
                                )}
                                {errors[f.key] && (
                                    <p className="text-red-500 text-xs mt-1 text-center">{errors[f.key]}</p>
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#800000] text-white rounded-xl py-3.5 font-semibold text-sm mt-2 active:opacity-90 transition-opacity disabled:opacity-60"
                        >
                            {processing ? t.loading : t.submit}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        {t.hasAccount}{" "}
                        <a href="/login" className="text-[#800000] font-semibold">
                            {t.login}
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
