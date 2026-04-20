import { useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { useState } from "react";

const T = {
    ar: {
        title:     "تسجيل الدخول - قمرة",
        subtitle:  "سجّل دخولك للمتابعة",
        email:     "البريد الإلكتروني",
        password:  "كلمة المرور",
        submit:    "تسجيل الدخول",
        loading:   "جارٍ الدخول...",
        noAccount: "ليس لديك حساب؟",
        register:  "إنشاء حساب",
    },
    en: {
        title:     "Login - Qumra",
        subtitle:  "Sign in to continue",
        email:     "Email Address",
        password:  "Password",
        submit:    "Sign In",
        loading:   "Signing in...",
        noAccount: "Don't have an account?",
        register:  "Create Account",
    },
};

export default function Login() {
    const [lang, setLang] = useState("ar");
    const t = T[lang];
    const isAr = lang === "ar";

    const { data, setData, post, processing, errors } = useForm({
        email:    "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <>
            <Head title={t.title} />
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4" dir={isAr ? "rtl" : "ltr"}>
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
                    <div className="flex flex-col items-center mb-10">
                        <img src="/images/dark-logo.png" alt="قمرة" className="h-20 object-contain mb-3" />
                        <p className="text-gray-500 text-sm">{t.subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-center">
                                {t.email}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData("email", e.target.value)}
                                placeholder="example@email.com"
                                autoComplete="email"
                                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent placeholder:text-gray-400 ${
                                    errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
                                }`}
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 text-center">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 text-center">
                                {t.password}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData("password", e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent placeholder:text-gray-400 ${
                                    errors.password ? "border-red-400 bg-red-50" : "border-gray-200"
                                }`}
                                required
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 text-center">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#800000] text-white rounded-xl py-3.5 font-semibold text-sm mt-2 active:opacity-90 transition-opacity disabled:opacity-60"
                        >
                            {processing ? t.loading : t.submit}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        {t.noAccount}{" "}
                        <a href="/register" className="text-[#800000] font-semibold">
                            {t.register}
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
