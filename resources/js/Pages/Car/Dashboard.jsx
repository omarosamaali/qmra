import { useState, useEffect, useRef, useCallback } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
const T = {
    ar: {
        greeting: "مرحباً~ اليوم يوم جديد مليء بالحيوية~",
        home: "الرئيسية", back: "رجوع", light_btn: "الثيم", settings: "الإعدادات",
        notes: "المفكرة", audio: "الصوتيات", toggleLang: "اللغة",
        appearance: "المظهر", light: "فاتح", dark: "داكن", language: "اللغة",
        brightness: "السطوع", notifications: "الإشعارات", goBack: "← رجوع",
        settingsTitle: "الإعدادات", pinSecurity: "🔒 أمان PIN", noPin: "لا يوجد رمز PIN",
        setPin: "تعيين رمز", deletePin: "حذف الرمز", enterPin: "أدخل رمز PIN",
        pinTitle: "أمان PIN", confirmPin: "تأكيد الرمز", pinMismatch: "الرمزان غير متطابقان",
        pinSet: "تم تعيين الرمز بنجاح", pinWrong: "رمز خاطئ! المحاولات المتبقية:",
        pinLocked: "التطبيق مقفل، أدخل رمز PIN للمتابعة",
        reminders: "🔔 المنبهات", addReminder: "+ إضافة منبه", save: "حفظ", cancel: "إلغاء",
        reminderTitle: "العنوان", reminderNote: "ملاحظة (اختياري)", reminderTime: "الوقت",
        prayerNext: "الصلاة القادمة", maintenance: "الصيانة القادمة", oilChange: "تغيير زيت المحرك",
        prayerNames: { Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" },
        prayerTime: "حان وقت صلاة", reminderAlert: "تذكير:",
        kilometer: "الكيلومترا", carNum: "رقم السيارة", modelYear: "الموديل والسنة",
        pinDeleted: "تم حذف الرمز", pinActive: "✅ PIN مفعّل",
        assistantLabel: "المساعد الصوتي",
        assistantSakr: "حمد", assistantHamda: "شيخة",
        assistantSakrDesc: "مساعد ذكي ذكر", assistantHamdaDesc: "مساعدة ذكية أنثى",
        welcome: "مرحباً،",
        noLinkTitle: "الجهاز غير مرتبط",
        noLinkDesc: "افتح تطبيق قمرة على هاتفك واضغط أيقونة العين بجانب العربية لربط هذا الجهاز.",
        noLinkBtn: "ربط الجهاز",
        noReminders: "لا توجد منبهات", noNotes: "لا توجد ملاحظات بعد",
        tapToSpeak: "اضغط للكلام",
        noteTitle: "العنوان...", noteBody: "اكتب ملاحظتك هنا...", saveNote: "حفظ الملاحظة",
        addReminderNew: "إضافة منبه جديد",
        quran: "القرآن الكريم", audiobooks: "كتب مسموعة", radio: "الراديو", ruqyah: "الرقية الشرعية",
        deleting: "جارٍ الحذف...",
    },
    en: {
        assistantLabel: "Voice Assistant",
        assistantSakr: "Hamad", assistantHamda: "Sheikha",
        assistantSakrDesc: "Male AI Assistant", assistantHamdaDesc: "Female AI Assistant",
        greeting: "Hi~ Today is another day full of vitality~",
        home: "Home", back: "Back", light_btn: "Theme", settings: "Settings",
        notes: "Notes", audio: "Audio", toggleLang: "Language",
        appearance: "Appearance", light: "Light", dark: "Dark", language: "Language",
        brightness: "Brightness", notifications: "Notifications", goBack: "← Back",
        settingsTitle: "Settings", pinSecurity: "🔒 PIN Security", noPin: "No PIN set",
        setPin: "Set PIN", deletePin: "Delete PIN", enterPin: "Enter PIN",
        pinTitle: "PIN Security", confirmPin: "Confirm PIN", pinMismatch: "PINs don't match",
        pinSet: "PIN set successfully", pinWrong: "Wrong PIN! Attempts left:",
        pinLocked: "App is locked, enter PIN to continue",
        reminders: "🔔 Reminders", addReminder: "+ Add Reminder", save: "Save", cancel: "Cancel",
        reminderTitle: "Title", reminderNote: "Note (optional)", reminderTime: "Time",
        prayerNext: "Next Prayer", maintenance: "Next Maintenance", oilChange: "Engine Oil Change",
        prayerNames: { Fajr: "Fajr", Sunrise: "Sunrise", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha" },
        prayerTime: "It's time for", reminderAlert: "Reminder:",
        kilometer: "Odometer", carNum: "Plate No.", modelYear: "Model & Year",
        pinDeleted: "PIN deleted", pinActive: "✅ PIN Active",
        welcome: "Welcome,",
        noLinkTitle: "Device not linked",
        noLinkDesc: "Open the Qumra phone app and tap the eye icon next to your car to link this device.",
        noLinkBtn: "Link Device",
        noReminders: "No reminders", noNotes: "No notes yet",
        tapToSpeak: "Tap to speak",
        noteTitle: "Title...", noteBody: "Write your note here...", saveNote: "Save Note",
        addReminderNew: "Add New Reminder",
        quran: "Holy Quran", audiobooks: "Audiobooks", radio: "Radio", ruqyah: "Ruqyah",
        deleting: "Deleting...",
    }
};

const SK = { pin: "car_pin", reminders: "car_reminders", theme: "car_theme", lang: "car_lang", notif: "car_notif", brt: "car_brt" };
const CHANNELS = {
    quran: [
        { ar: "سورة الفاتحة - العفاسي",     en: "Al-Fatiha - Al-Afasy",    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3" },
        { ar: "سورة يس - العفاسي",          en: "Ya-Sin - Al-Afasy",        url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/36.mp3" },
        { ar: "سورة الملك - العفاسي",        en: "Al-Mulk - Al-Afasy",      url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/67.mp3" },
        { ar: "سورة الكهف - العفاسي",        en: "Al-Kahf - Al-Afasy",      url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/18.mp3" },
        { ar: "سورة البقرة - عبد الباسط",    en: "Al-Baqara - Abdul Basit", url: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal/2.mp3" },
    ],
    audiobooks: [
        { ar: "إذاعة BBC عربي",              en: "BBC Arabic Radio",        url: "https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio" },
        { ar: "سورة المُلك - عبد الباسط",    en: "Al-Mulk - Abdul Basit",   url: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal/67.mp3" },
    ],
    radio: [
        { ar: "BBC عربي",                    en: "BBC Arabic",              url: "https://stream.live.vc.bbcmedia.co.uk/bbc_arabic_radio" },
        { ar: "سورة الرحمن - المنشاوي",       en: "Ar-Rahman - Al-Minshawi", url: "https://cdn.islamic.network/quran/audio/128/ar.minshawi/55.mp3" },
        { ar: "سورة الواقعة - المنشاوي",      en: "Al-Waqi'a - Al-Minshawi", url: "https://cdn.islamic.network/quran/audio/128/ar.minshawi/56.mp3" },
    ],
    ruqyah: [
        { ar: "الرقية الشرعية - العفاسي",    en: "Ruqyah - Al-Afasy",       url: "https://server7.mp3quran.net/afs/ruqya.mp3" },
        { ar: "سورة البقرة - العفاسي",       en: "Al-Baqara - Al-Afasy",    url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3" },
        { ar: "آية الكرسي - العفاسي",        en: "Ayat Al-Kursi - Afasy",   url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/255.mp3" },
    ],
};
const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const load = (k, d) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };

export default function CarDashboard({ userName }) {
    const [theme, setThemeR] = useState(() => load(SK.theme, "dark"));
    const [lang, setLangR] = useState(() => load(SK.lang, "ar"));
    const [brt, setBrtR] = useState(() => load(SK.brt, 80));
    const [notifOn, setNotifR] = useState(() => load(SK.notif, true));
    const [reminders, setRemsR] = useState(() => load(SK.reminders, []));
    const [savedPin, setSavedPinR] = useState(() => load(SK.pin, null));

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [notesOpen, setNotesOpen]       = useState(false);
    const [audioOpen, setAudioOpen]       = useState(false);
    const [remindersOpen, setRemindersOpen] = useState(false);
    const [notesList, setNotesList]       = useState(() => load("car_notes", []));
    const [noteForm, setNoteForm]         = useState({ title: "", body: "" });
    const saveNote = () => {
        if (!noteForm.title.trim() && !noteForm.body.trim()) return;
        const updated = [{ id: Date.now(), ...noteForm, date: new Date().toLocaleDateString("ar-EG") }, ...notesList];
        setNotesList(updated); save("car_notes", updated);
        setNoteForm({ title: "", body: "" });
    };
    const delNote = id => { const updated = notesList.filter(n => n.id !== id); setNotesList(updated); save("car_notes", updated); };
    const [pinMode, setPinMode] = useState("idle");
    const [pinInput, setPinInput] = useState([]);
    const [pinConf, setPinConf] = useState([]);
    const [pinStep, setPinStep] = useState("first");
    const [pinErr, setPinErr] = useState("");
    const [pinAttempts, setPinAttempts] = useState(3);
    const [unlocked, setUnlocked] = useState(() => !load(SK.pin, null));
    const [shakePin, setShakePin] = useState(false);

    const [prayers, setPrayers] = useState({});
    const [nextPrayer, setNextPrayer] = useState(null);
    const [now, setNow] = useState(new Date());
    const [toasts, setToasts] = useState([]);
    const [isLandscape, setIsLandscape] = useState(() => {
        const saved = localStorage.getItem("car_layout");
        if (saved === "landscape") return true;
        if (saved === "portrait")  return false;
        return window.innerWidth > window.innerHeight;
    });

    // ── Real vehicle & reminders from API ────────────────────────────────────
    const [vehicleData, setVehicleData]     = useState(null);
    const [nextReminder, setNextReminder]   = useState(null);
    const [noLink, setNoLink]               = useState(false);

    useEffect(() => {
        const linkCode = localStorage.getItem("car_link_code");
        if (!linkCode) { setNoLink(true); return; }
        axios.get(`/api/car/vehicle/${linkCode}`)
            .then(r => setVehicleData(r.data))
            .catch(() => setNoLink(true));
        axios.get(`/api/car/reminders/${linkCode}`)
            .then(r => setNextReminder(r.data?.[0] ?? null))
            .catch(() => {});
    }, []);

    const [rFormOpen, setRFormOpen] = useState(false);
    const [rTitle, setRTitle] = useState("");
    const [rDate, setRDate] = useState("");
    const [rTime, setRTime] = useState("");
    const [rNote, setRNote] = useState("");

    // ── AI Voice state ────────────────────────────────────────────────────────
    const [aiState, setAiState] = useState("idle");   // idle | listening | thinking | speaking
    const [aiText, setAiText] = useState("");        // last AI reply text
    const [aiCaption, setAiCaption] = useState("");        // transcript of user
    const mediaRecRef = useRef(null);
    const audioChunks = useRef([]);
    const synthUtter = useRef(null);
    const audioRef = useRef(null);
    const [nowPlaying, setNowPlaying] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const [audioSubScreen, setAudioSubScreen] = useState(null);

    const t = T[lang];
    const isDark = theme === "dark";

    const setTheme = v => { setThemeR(v); save(SK.theme, v); };
    const setLang = v => { setLangR(v); save(SK.lang, v); };
    const setBrt = v => { setBrtR(v); save(SK.brt, v); };
    const setNotif = v => { setNotifR(v); save(SK.notif, v); };
    const setRems = v => { setRemsR(v); save(SK.reminders, v); };
    const setSavedPin = v => { setSavedPinR(v); save(SK.pin, v); };
    const [aiAssistant, setAiAssistantR] = useState(() => load("car_assistant", "hamda"));
    const setAiAssistant = v => { setAiAssistantR(v); save("car_assistant", v); };
    useEffect(() => {
        const el = document.createElement("style");
        el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
      *{box-sizing:border-box;margin:0;padding:0;font-family:'Cairo',sans-serif}
      input[type=range]{accent-color:#b91c1c}
      .glass{border-radius:15px}
      .tgl{width:44px;height:24px;border-radius:9999px;position:relative;cursor:pointer;transition:background .3s}
      .tgl .knob{position:absolute;top:2px;width:20px;height:20px;background:white;border-radius:50%;transition:left .3s}
      .tgl.on{background:#b91c1c}.tgl.on .knob{left:22px}
      .tgl.off{background:rgba(255,255,255,.2)}.tgl.off .knob{left:2px}
      @keyframes sIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
      @keyframes fOut{from{opacity:1}to{opacity:0}}
      .toast{animation:sIn .3s ease}.toast.die{animation:fOut .4s ease forwards}
      @keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
      .shk{animation:shk .4s ease}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes pulse{0%,100%{box-shadow:0 0 0 8px rgba(239,68,68,0.25),0 0 0 16px rgba(239,68,68,0.1)}50%{box-shadow:0 0 0 12px rgba(239,68,68,0.35),0 0 0 22px rgba(239,68,68,0.15)}}
    `;
        document.head.appendChild(el);
        return () => document.head.removeChild(el);
    }, []);

    useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

    useEffect(() => {
        const onResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", onResize);
        return () => { window.removeEventListener("resize", onResize); window.removeEventListener("orientationchange", onResize); };
    }, []);

    useEffect(() => {
        fetch("https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5")
            .then(r => r.json()).then(d => {
                if (d.code === 200) { const p = {}; PRAYERS.forEach(n => { if (d.data.timings[n]) p[n] = d.data.timings[n]; }); setPrayers(p); }
            }).catch(() => { });
    }, []);

    useEffect(() => {
        if (!Object.keys(prayers).length) return;
        const pad = n => String(n).padStart(2, "0");
        const cur = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        let found = null;
        for (const n of PRAYERS) { if (prayers[n] && prayers[n] > cur) { found = { name: n, time: prayers[n] }; break; } }
        if (!found) found = { name: PRAYERS[0], time: prayers[PRAYERS[0]] };
        setNextPrayer(found);
    }, [prayers, now]);

    const addToast = useCallback((msg, type = "info") => {
        if (!notifOn) return;
        const id = Date.now();
        setToasts(p => [...p, { id, msg, type, die: false }]);
        setTimeout(() => setToasts(p => p.map(x => x.id === id ? { ...x, die: true } : x)), 3500);
        setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 4000);
    }, [notifOn]);

    // ── AI Voice logic ────────────────────────────────────────────────────────
    const stopSpeaking = () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setAiState("idle");
    };

    const playChannel = (ch) => {
        if (!audioRef.current) return;
        setAudioError(false);
        audioRef.current.pause();
        audioRef.current.src = ch.url;
        audioRef.current.load();
        audioRef.current.play().catch(() => { setAudioError(true); setIsPlaying(false); });
        setNowPlaying(ch);
        setIsPlaying(true);
    };
    const togglePlay = () => {
        if (!audioRef.current || !nowPlaying) return;
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { setAudioError(false); audioRef.current.play().catch(() => { setAudioError(true); }); setIsPlaying(true); }
    };
    const stopAudio = () => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
        setIsPlaying(false);
        setNowPlaying(null);
        setAudioError(false);
    };

    const speakText = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = lang === "ar" ? "ar-EG" : "en-US";
        utter.rate = 1.0;
        utter.pitch = 1.1;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => lang === "ar" ? v.lang.startsWith("ar") : v.lang.startsWith("en"));
        if (preferred) utter.voice = preferred;
        utter.onstart = () => setAiState("speaking");
        utter.onend = () => setAiState("idle");
        utter.onerror = () => setAiState("idle");
        synthUtter.current = utter;
        setAiState("speaking");
        window.speechSynthesis.speak(utter);
    };

    const askClaude = async (userText) => {
        setAiState("thinking");
        setAiText("");

        const isSakr = aiAssistant === "sakr";
        const systemPrompt = lang === "ar"
            ? isSakr
                ? "أنت مساعد سيارة ذكي اسمك 'صقر'. شخصيتك جادة وواثقة وذكورية. أجب بإجابات قصيرة وودية بالعربية. لا تزيد عن جملتين أو ثلاث."
                : "أنتِ مساعدة سيارة ذكية اسمك 'حمدة'. شخصيتك ودودة ولطيفة وأنثوية. أجيبي بإجابات قصيرة وودية بالعربية. لا تزيدي عن جملتين أو ثلاث."
            : isSakr
                ? "You are a smart car assistant named 'Saqr'. You have a confident, professional male personality. Give short friendly replies in English. Max 2-3 sentences."
                : "You are a smart car assistant named 'Hamda'. You have a warm, friendly female personality. Give short friendly replies in English. Max 2-3 sentences.";


        
        try {
            const res = await fetch("#", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system: lang === "ar"
                        ? "أنت مساعد سيارة ذكي اسمك 'كارا'. أجب بإجابات قصيرة وودية بالعربية. لا تزيد عن جملتين أو ثلاث."
                        : "You are a smart car assistant named 'Kara'. Give short friendly replies in English. Max 2-3 sentences.",
                    messages: [{ role: "user", content: userText }]
                })
            });
            const data = await res.json();
            const reply = data.content?.find(c => c.type === "text")?.text || (lang === "ar" ? "عذراً، لم أفهم." : "Sorry, I didn't understand.");
            setAiText(reply);
            speakText(reply);
        } catch {
            const err = lang === "ar" ? "حدث خطأ في الاتصال." : "Connection error.";
            setAiText(err);
            speakText(err);
        }
    };

    const startListening = () => {
        if (aiState !== "idle") { stopSpeaking(); return; }
        setAiCaption("");
        setAiText("");

        // Try Web Speech API first (browser transcription)
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            const rec = new SR();
            rec.lang = lang === "ar" ? "ar-EG" : "en-US";
            rec.interimResults = false;
            rec.maxAlternatives = 1;
            setAiState("listening");
            rec.onresult = e => {
                const transcript = e.results[0][0].transcript;
                setAiCaption(transcript);
                askClaude(transcript);
            };
            rec.onerror = () => {
                setAiState("idle");
                addToast(lang === "ar" ? "تعذّر الوصول للميكروفون" : "Microphone access denied", "info");
            };
            rec.onend = () => { if (aiState === "listening") setAiState("idle"); };
            rec.start();
        } else {
            addToast(lang === "ar" ? "المتصفح لا يدعم التعرف على الصوت" : "Browser doesn't support speech recognition", "info");
        }
    };

    const notifiedP = useRef(new Set());
    useEffect(() => {
        if (!nextPrayer || !notifOn) return;
        const pad = n => String(n).padStart(2, "0");
        const cur = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const key = `${nextPrayer.name}-${cur}`;
        if (cur === nextPrayer.time && !notifiedP.current.has(key)) {
            notifiedP.current.add(key);
            addToast(`🕌 ${t.prayerTime} ${t.prayerNames[nextPrayer.name]}`, "prayer");
        }
    }, [now, nextPrayer, notifOn, t, addToast]);

    const notifiedR = useRef(new Set());
    useEffect(() => {
        const pad = n => String(n).padStart(2, "0");
        const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const cur = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
        reminders.forEach(r => {
            if (!r.time) return;
            const key = `${r.id}-${r.date}-${r.time}`;
            if (r.date === today && r.time === cur && !notifiedR.current.has(key)) {
                notifiedR.current.add(key);
                addToast(`🔔 ${t.reminderAlert} ${r.title}`, "reminder");
            }
        });
    }, [now, reminders, notifOn, t, addToast]);

    const shake = () => { setShakePin(true); setTimeout(() => setShakePin(false), 500); };

    const pinPress = n => {
        if (pinMode === "set") {
            if (pinStep === "first") {
                const nx = [...pinInput, n]; setPinInput(nx);
                if (nx.length === 4) { setPinConf(nx); setPinStep("second"); setPinInput([]); setPinErr(""); }
            } else {
                const nx = [...pinInput, n]; setPinInput(nx);
                if (nx.length === 4) {
                    if (pinConf.join("") === nx.join("")) { setSavedPin(nx.join("")); setPinMode("idle"); setPinInput([]); setPinConf([]); setPinStep("first"); setPinErr(""); addToast("✅ " + t.pinSet, "success"); }
                    else { shake(); setPinErr(t.pinMismatch); setPinInput([]); setPinStep("first"); setPinConf([]); }
                }
            }
        } else if (pinMode === "unlock") {
            const nx = [...pinInput, n]; setPinInput(nx);
            if (nx.length === 4) {
                if (nx.join("") === savedPin) { setUnlocked(true); setPinMode("idle"); setPinInput([]); setPinAttempts(3); setPinErr(""); }
                else { shake(); const l = pinAttempts - 1; setPinAttempts(l); setPinErr(`${t.pinWrong} ${l}`); setPinInput([]); }
            }
        }
    };
    const pinDel = () => setPinInput(p => p.slice(0, -1));
    const openSetPin = () => { setPinMode("set"); setPinStep("first"); setPinInput([]); setPinConf([]); setPinErr(""); };
    const closePin = () => { if (pinMode !== "unlock") { setPinMode("idle"); setPinInput([]); setPinStep("first"); setPinErr(""); } };
    const deletePin = () => { setSavedPin(null); addToast("🗑️ " + t.pinDeleted, "info"); };

    const saveRem = () => {
        if (!rTitle || !rDate) return;
        const r = { id: Date.now(), title: rTitle, date: rDate, time: rTime, note: rNote };
        setRems([...reminders, r]); setRTitle(""); setRDate(""); setRTime(""); setRNote(""); setRFormOpen(false);
        addToast(`✅ ${t.reminderAlert} ${r.title}`, "success");
    };
    const delRem = id => setRems(reminders.filter(r => r.id !== id));

    const pad = n => String(n).padStart(2, "0");
    const h12 = now.getHours() % 12 || 12;
    const ampm = now.getHours() < 12 ? "AM" : "PM";
    const clockStr = `${pad(h12)}:${pad(now.getMinutes())}`;
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    const bg      = isDark
        ? "linear-gradient(to top,#0d0d0d 10%,#1a0a0a 55%,#2a1010 100%)"
        : "linear-gradient(to top,#f5e8e8 0%,#ede0e0 100%)";
    const cardBg  = isDark
        ? "linear-gradient(135deg,#2a1010,#1a0808)"
        : "linear-gradient(135deg,#ffffff,#fdf0f0)";
    const centerBg = isDark
        ? "linear-gradient(135deg,#110000,#0d0d0d)"
        : "linear-gradient(135deg,#fff8f8,#fef0f0)";
    const tp      = isDark ? "#ffffff"              : "#1a0000";
    const ts      = isDark ? "#c9a0a0"              : "#5a2020";
    const tm      = isDark ? "rgba(255,180,180,0.4)": "rgba(100,0,0,0.35)";
    const sBg     = isDark
        ? "linear-gradient(135deg,#1a0808,#120404)"
        : "linear-gradient(135deg,#fdf0f0,#fce8e8)";
    const rowBg   = isDark ? "rgba(128,0,0,0.12)"   : "rgba(128,0,0,0.06)";
    const ppBg    = isDark ? "#1a0808"              : "#fdf0f0";
    const pbBg    = isDark ? "rgba(128,0,0,0.2)"    : "rgba(128,0,0,0.08)";
    const botBg   = isDark ? "rgba(13,0,0,0.95)"    : "rgba(255,248,248,0.9)";

    const pinModalOpen = pinMode === "set" || pinMode === "unlock";
    const dotsCount = pinMode === "set" && pinStep === "second" ? pinConf.length : pinInput.length;
    const pinLabel = pinMode === "unlock" ? t.pinLocked : pinStep === "first" ? t.enterPin : t.confirmPin;

    const toastColors = { prayer: "#7c3aed", reminder: "#b91c1c", success: "#059669", info: "#1d4ed8" };

    if (noLink) return (
        <div dir={lang === "ar" ? "rtl" : "ltr"} style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", background: "#0f0f0f", color: "#fff", fontFamily: "'Cairo',sans-serif" }}>
            <Head title="Dashboard" />
            <img src="/images/main-logo.png" alt="قمرة" style={{ height: "60px", objectFit: "contain" }} />
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{t.noLinkTitle}</p>
            <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", maxWidth: "280px" }}>
                {t.noLinkDesc}
            </p>
            <button
                onClick={() => { localStorage.removeItem("car_link_code"); window.location.href = "/car"; }}
                style={{ marginTop: "8px", background: "#800000", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 28px", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}
            >
                {t.noLinkBtn}
            </button>
        </div>
    );

    return (
        <div dir={lang === "ar" ? "rtl" : "ltr"} style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "16px", background: bg, fontFamily: "'Cairo',sans-serif", color: tp, overflow: "hidden", filter: `brightness(${brt / 100 * 0.5 + 0.5})` }}>
            <Head title="Dashboard" />

            {/* Lock Screen */}
            {!unlocked && (
                <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.96)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
                    <div style={{ fontSize: "72px" }}>🔒</div>
                    <p style={{ color: "white", fontSize: "18px", textAlign: "center" }}>{t.pinLocked}</p>
                    <button onClick={() => setPinMode("unlock")} style={{ background: "#b91c1c", color: "white", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "16px", cursor: "pointer", marginTop: "8px" }}>{t.enterPin}</button>
                </div>
            )}


            {/* Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 24px", fontSize: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ color: ts, fontSize: "13px" }}>
                        {t.welcome} {userName ?? ""}
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#fafafa" }}><i className="fas fa-satellite-dish" /> GPS</span>
                    <i className="fas fa-wifi" style={{ color: ts }} />
                </div>
            </div>

            {/* Main */}
            <div style={{ display: "flex", flex: 1, flexDirection: isLandscape ? "row" : "column", gap: "16px", marginTop: "8px", overflow: "hidden" }}>

                {/* Side panel */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: isLandscape ? "28%" : "100%",
                    flexShrink: 0,
                    overflowY: "auto",
                }}>
                    {/* Clock */}
                    <div className="glass" style={{ padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: cardBg }}>
                        <AnalogClock now={now} size={80} />
                        <div style={{ fontSize: "11px", color: ts, marginTop: "4px", textAlign: "center" }}>{dateStr}</div>
                        <div style={{ fontSize: "12px", fontWeight: 300, color: tp, marginTop: "2px" }}>25°C</div>
                    </div>

                    {/* Apps Grid */}
                    <div className="glass" style={{ padding: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", background: cardBg, gap: "6px", alignContent: "center" }}>
                        {[
                            { icon: "fa-undo",        label: t.back,                        bg: "linear-gradient(135deg,#7dd86a,#4aaa38)",  onClick: () => {
                                if (settingsOpen)   { setSettingsOpen(false);   return; }
                                if (notesOpen)      { setNotesOpen(false);      return; }
                                if (remindersOpen)  { setRemindersOpen(false);  return; }
                                if (audioOpen)      { setAudioOpen(false);      return; }
                            } },
                            { icon: "fa-sticky-note", label: t.notes,                        bg: "linear-gradient(135deg,#1eeef7,#05adb4)",  onClick: () => setNotesOpen(true) },
                            { icon: "fa-bell",        label: t.reminders.replace("🔔 ",""), bg: "linear-gradient(135deg,#7aedbc,#34c88a)",  onClick: () => setRemindersOpen(true) },
                            { icon: "fa-music",       label: t.audio,                        bg: "linear-gradient(135deg,#2ffab0,#12a872)",  onClick: () => setAudioOpen(true) },
                        ].map((a, i) => (
                            <div key={i} onClick={a.onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", cursor: "pointer" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", background: a.bg }}>
                                    <i className={`fas ${a.icon}`} />
                                </div>
                                <span style={{ fontSize: "9px", color: ts }}>{a.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Maintenance */}
                    <div className="glass" style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px", background: cardBg }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: tp, fontSize: "13px", fontWeight: "bold" }}>
                            <i className="fas fa-tools" /><span>{t.maintenance}</span>
                        </div>
                        {nextReminder ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={{ color: "#60a5fa", display: "flex", gap: "6px", alignItems: "center", fontSize: "13px", fontWeight: "600" }}>
                                    <i className="fas fa-wrench" /><span>{nextReminder.titleAr}</span>
                                </div>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {nextReminder.dueDate && <span style={{ color: tm, fontSize: "12px" }}>📅 {nextReminder.dueDate}</span>}
                                    {nextReminder.dueKm  && <span style={{ color: tm, fontSize: "12px" }}>🛣️ {Number(nextReminder.dueKm).toLocaleString()} كم</span>}
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: tm, fontSize: "12px" }}>{vehicleData ? "لا توجد تنبيهات" : "—"}</div>
                        )}
                    </div>

                    {/* Prayer */}
                    <div className="glass" style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px", background: cardBg }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: tp, fontSize: "13px", fontWeight: "bold" }}>
                            <i className="fas fa-mosque" /><span>{t.prayerNext}</span>
                        </div>
                        {nextPrayer
                            ? <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#60a5fa", fontSize: "13px", fontWeight: "600" }}>
                                <i className="fas fa-sun" /><span>{t.prayerNames[nextPrayer.name]} {nextPrayer.time}</span>
                              </div>
                            : <div style={{ color: tm, fontSize: "12px" }}>...</div>}
                    </div>
                </div>

                {/* Center */}
                <div className="glass" style={{
                    flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    background: centerBg,
                    border: `1px solid ${isDark ? "rgba(128,0,0,0.4)" : "rgba(128,0,0,0.2)"}`
                }}>

                    {/* Notifications — centered overlay over assistant */}
                    {toasts.length > 0 && (
                        <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", pointerEvents: "none" }}>
                            {toasts.map(x => (
                                <div key={x.id} className={`toast${x.die ? " die" : ""}`}
                                    onClick={() => setToasts(p => p.filter(t => t.id !== x.id))}
                                    style={{
                                        pointerEvents: "auto",
                                        background: toastColors[x.type] || "#374151",
                                        color: "white",
                                        padding: "18px 32px",
                                        borderRadius: "20px",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        boxShadow: `0 0 40px 4px ${toastColors[x.type] || "#374151"}88, 0 8px 32px rgba(0,0,0,0.7)`,
                                        cursor: "pointer",
                                        direction: lang === "ar" ? "rtl" : "ltr",
                                        textAlign: "center",
                                        backdropFilter: "blur(12px)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        maxWidth: "80%",
                                    }}>
                                    {x.msg}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* AI GIF — switches based on assistant × theme × talking state */}
                    <div style={{ flexDirection: "column", position: "relative", display: "flex", alignItems: "center", paddingTop: "12px" , flex: 1, width: "100%", gap: "24px" }}>

                        <img src={!isDark ? "/images/dark-logo.png" : "/images/main-logo.png"} alt="قمرة" style={{ height: "62px", objectFit: "contain" }} />

                        <img
                            src={`/images/${aiAssistant === "sakr" ? "hamad" : "Sheikha"}-${aiState === "speaking" ? "talk" : "stop"}-${isDark ? "dark" : "white"}.gif`}
                            style={{ width: "90%", paddingTop: "40px", transition: "opacity .3s", filter: aiState === "speaking" ? "drop-shadow(0 20px 40px rgba(100,180,255,0.4))" : "none" }}
                            alt="AI assistant"
                        />

                        {/* Thinking spinner overlay */}
                        {aiState === "thinking" && (
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ width: "56px", height: "56px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #60a5fa", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                            </div>
                        )}
                    </div>

                    {/* Transcript / reply bubble */}
                    {(aiCaption || aiText) && (
                        <div style={{ position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)", maxWidth: "80%", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
                            {aiCaption && (
                                <div style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.7)", fontSize: "12px", padding: "6px 14px", borderRadius: "20px", textAlign: "center" }}>
                                    🎤 {aiCaption}
                                </div>
                            )}
                            {aiText && (
                                <div style={{ background: "rgba(59,130,246,0.25)", backdropFilter: "blur(8px)", border: "1px solid rgba(96,165,250,0.4)", color: "white", fontSize: "13px", padding: "8px 16px", borderRadius: "20px", textAlign: "center", maxWidth: "100%" }}>
                                    {aiText}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mic Button + Vehicle Info */}
                    <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                        {/* Vehicle info row */}
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", borderRadius: "20px", padding: "6px 14px", whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "white", fontSize: "11px" }}>
                                <i className="fas fa-tachometer-alt" style={{ color: "white", fontSize: "11px" }} />
                                <span style={{ fontWeight: "bold" }}>{vehicleData ? Number(vehicleData.km).toLocaleString() : "—"}</span>
                            </div>
                            <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "white", fontSize: "11px" }}>
                                <i className="fas fa-id-card" style={{ color: "white", fontSize: "11px" }} />
                                <span style={{ fontWeight: "bold" }}>{vehicleData?.plateNumber ?? "—"}</span>
                            </div>
                            <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "white", fontSize: "11px", flexShrink: 0 }}>
                                <i className="fas fa-car" style={{ color: "white", fontSize: "11px" }} />
                                <span style={{ fontWeight: "bold" }}>{vehicleData ? `${lang === "ar" ? vehicleData.nameAr : (vehicleData.nameEn || vehicleData.nameAr)} ${vehicleData.year}` : "—"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="glass" style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "8px 16px", background: botBg, gap: "4px" }}>
                {[
                    { icon: "fa-home",       label: t.home,        onClick: () => {} },
                    { icon: "fa-language",   label: t.toggleLang,  onClick: () => setLang(lang === "ar" ? "en" : "ar") },
                    { icon: isDark ? "fa-sun" : "fa-moon", label: t.light_btn, onClick: () => setTheme(isDark ? "light" : "dark") },
                    { icon: "fa-cog",        label: t.settings,    onClick: () => setSettingsOpen(true) },
                ].map((item, i) => (
                    <div key={i} onClick={item.onClick}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", cursor: "pointer", padding: "4px 8px", borderRadius: "10px", transition: "background .2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(185,28,28,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <i className={`fas ${item.icon}`} style={{ fontSize: "18px", color: tp }} />
                        <span style={{ fontSize: "10px", color: ts, whiteSpace: "nowrap" }}>{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Hidden audio element */}
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} onError={() => { setAudioError(true); setIsPlaying(false); }} style={{ display: "none" }} />

            {/* ══ Mini Player Bar ══ */}
            {nowPlaying && (
                <div style={{ position: "fixed", bottom: "70px", left: "50%", transform: "translateX(-50%)", zIndex: 40, display: "flex", alignItems: "center", gap: "10px", background: isDark ? "rgba(20,0,0,0.92)" : "rgba(255,248,248,0.95)", backdropFilter: "blur(12px)", border: `1px solid ${audioError ? "rgba(239,68,68,0.5)" : isDark ? "rgba(185,28,28,0.4)" : "rgba(185,28,28,0.2)"}`, borderRadius: "30px", padding: "8px 16px", maxWidth: "320px", width: "90%", direction: "rtl" }}>
                    <span style={{ fontSize: "18px" }}>{audioError ? "⚠️" : "🎵"}</span>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <p style={{ color: tp, fontSize: "12px", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lang === "ar" ? nowPlaying.ar : nowPlaying.en}</p>
                        {audioError && <p style={{ color: "#ef4444", fontSize: "10px" }}>{lang === "ar" ? "تعذّر تشغيل البث" : "Stream unavailable"}</p>}
                    </div>
                    {!audioError && (
                        <button onClick={togglePlay} style={{ background: "#b91c1c", border: "none", borderRadius: "50%", width: "28px", height: "28px", color: "white", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`} />
                        </button>
                    )}
                    <button onClick={stopAudio} style={{ background: "rgba(185,28,28,0.2)", border: "none", borderRadius: "50%", width: "24px", height: "24px", color: tp, cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fas fa-stop" />
                    </button>
                </div>
            )}

            {/* ══ Notes Modal ══ */}
            {notesOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
                    <div style={{ width: "100%", maxWidth: "420px", margin: "0 16px", borderRadius: "16px", background: sBg, direction: "rtl", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"}` }}>
                            <button onClick={() => setNotesOpen(false)} style={{ color: ts, background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>✕</button>
                            <h2 style={{ color: tp, fontWeight: "bold", fontSize: "18px" }}>📝 {t.notes}</h2>
                        </div>
                        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto" }}>
                            <input value={noteForm.title} onChange={e => setNoteForm(f => ({ ...f, title: e.target.value }))}
                                placeholder={t.noteTitle}
                                style={{ width: "100%", background: rowBg, color: tp, fontSize: "14px", borderRadius: "8px", padding: "8px 12px", outline: "none", border: "none", textAlign: lang === "ar" ? "right" : "left" }} />
                            <textarea value={noteForm.body} onChange={e => setNoteForm(f => ({ ...f, body: e.target.value }))}
                                placeholder={t.noteBody}
                                rows={3} style={{ width: "100%", background: rowBg, color: tp, fontSize: "14px", borderRadius: "8px", padding: "8px 12px", outline: "none", border: "none", resize: "none", textAlign: lang === "ar" ? "right" : "left" }} />
                            <button onClick={saveNote} style={{ background: "#b91c1c", color: "white", border: "none", borderRadius: "8px", padding: "8px", fontSize: "14px", cursor: "pointer" }}>
                                + {t.saveNote}
                            </button>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                                {notesList.map(n => (
                                    <div key={n.id} style={{ background: rowBg, borderRadius: "10px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <button onClick={() => delNote(n.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px", paddingRight: "6px" }}>🗑</button>
                                        <div style={{ textAlign: "right", flex: 1 }}>
                                            {n.title && <p style={{ color: tp, fontWeight: "bold", fontSize: "14px" }}>{n.title}</p>}
                                            {n.body  && <p style={{ color: ts, fontSize: "13px", marginTop: "2px" }}>{n.body}</p>}
                                            <p style={{ color: tm, fontSize: "11px", marginTop: "4px" }}>{n.date}</p>
                                        </div>
                                    </div>
                                ))}
                                {notesList.length === 0 && <p style={{ color: tm, textAlign: "center", fontSize: "13px" }}>{t.noNotes}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Reminders Shortcut Modal ══ */}
            {remindersOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
                    <div style={{ width: "100%", maxWidth: "420px", margin: "0 16px", borderRadius: "16px", background: sBg, direction: "rtl", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"}` }}>
                            <button onClick={() => setRemindersOpen(false)} style={{ color: ts, background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>✕</button>
                            <h2 style={{ color: tp, fontWeight: "bold", fontSize: "18px" }}>🔔 {lang === "ar" ? "المنبهات" : "Reminders"}</h2>
                        </div>
                        <div style={{ padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                            {reminders.length === 0
                                ? <p style={{ color: tm, textAlign: "center", fontSize: "13px" }}>{t.noReminders}</p>
                                : reminders.map(r => (
                                    <div key={r.id} style={{ background: rowBg, borderRadius: "10px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <button onClick={() => delRem(r.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px" }}>🗑</button>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ color: tp, fontWeight: "bold", fontSize: "14px" }}>{r.title}</p>
                                            <p style={{ color: tm, fontSize: "12px" }}>{r.date} {r.time}</p>
                                            {r.note && <p style={{ color: ts, fontSize: "12px" }}>{r.note}</p>}
                                        </div>
                                    </div>
                                ))
                            }
                            <button onClick={() => { setRemindersOpen(false); setSettingsOpen(true); }}
                                style={{ background: "#b91c1c", color: "white", border: "none", borderRadius: "8px", padding: "8px", fontSize: "13px", cursor: "pointer", marginTop: "4px" }}>
                                + {t.addReminderNew}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Audio Modal ══ */}
            {audioOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
                    <div style={{ width: "100%", maxWidth: "420px", margin: "0 16px", borderRadius: "16px", background: sBg, direction: "rtl", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${isDark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"}` }}>
                            {audioSubScreen
                                ? <button onClick={() => setAudioSubScreen(null)} style={{ color: ts, background: "none", border: "none", cursor: "pointer", fontSize: "13px" }}>← {lang === "ar" ? "رجوع" : "Back"}</button>
                                : <button onClick={() => setAudioOpen(false)} style={{ color: ts, background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>✕</button>
                            }
                            <h2 style={{ color: tp, fontWeight: "bold", fontSize: "18px" }}>
                                {audioSubScreen === "quran"      ? `📖 ${t.quran}`
                                : audioSubScreen === "audiobooks" ? `🎧 ${t.audiobooks}`
                                : audioSubScreen === "radio"      ? `📻 ${t.radio}`
                                : audioSubScreen === "ruqyah"     ? `🌿 ${t.ruqyah}`
                                : `🎵 ${t.audio}`}
                            </h2>
                        </div>

                        {/* Category grid */}
                        {!audioSubScreen && (
                            <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                {[
                                    { key: "quran",      icon: "fa-quran",      label: t.quran,      bg: "linear-gradient(135deg,#065f46,#047857)" },
                                    { key: "audiobooks", icon: "fa-headphones", label: t.audiobooks, bg: "linear-gradient(135deg,#1e3a5f,#1d4ed8)" },
                                    { key: "radio",      icon: "fa-radio",      label: t.radio,      bg: "linear-gradient(135deg,#7c2d12,#b91c1c)" },
                                    { key: "ruqyah",     icon: "fa-leaf",       label: t.ruqyah,     bg: "linear-gradient(135deg,#14532d,#15803d)" },
                                ].map(a => (
                                    <div key={a.key} onClick={() => setAudioSubScreen(a.key)}
                                        style={{ background: a.bg, borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", transition: "opacity .15s" }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                                        <i className={`fas ${a.icon}`} style={{ fontSize: "28px", color: "white" }} />
                                        <span style={{ color: "white", fontSize: "13px", fontWeight: "bold" }}>{a.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Channel list */}
                        {audioSubScreen && (
                            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto" }}>
                                {(CHANNELS[audioSubScreen] || []).map((ch, i) => {
                                    const active = nowPlaying?.url === ch.url;
                                    return (
                                        <div key={i} onClick={() => { if (active && isPlaying) { togglePlay(); } else { playChannel(ch); } }}
                                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: active ? "rgba(185,28,28,0.2)" : rowBg, border: `1px solid ${active ? "rgba(185,28,28,0.5)" : "transparent"}`, borderRadius: "12px", padding: "12px 16px", cursor: "pointer", transition: "all .15s" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: active ? "#b91c1c" : "rgba(185,28,28,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <i className={`fas ${active && isPlaying ? "fa-pause" : "fa-play"}`} style={{ color: "white", fontSize: "12px" }} />
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right", flex: 1 }}>
                                                <p style={{ color: tp, fontSize: "14px", fontWeight: active ? "bold" : "normal" }}>{lang === "ar" ? ch.ar : ch.en}</p>
                                                {active && isPlaying && !audioError && <p style={{ color: "#b91c1c", fontSize: "11px", marginTop: "2px" }}>{lang === "ar" ? "يُشغَّل الآن..." : "Now playing..."}</p>}
                                                {active && audioError && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "2px" }}>{lang === "ar" ? "⚠️ البث غير متاح" : "⚠️ Unavailable"}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Now playing row inside modal */}
                        {nowPlaying && (
                            <div style={{ margin: "0 16px 16px", background: "rgba(185,28,28,0.15)", borderRadius: "12px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "16px" }}>🎵</span>
                                <span style={{ flex: 1, color: tp, fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lang === "ar" ? nowPlaying.ar : nowPlaying.en}</span>
                                <button onClick={togglePlay} style={{ background: "#b91c1c", border: "none", borderRadius: "50%", width: "26px", height: "26px", color: "white", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`} />
                                </button>
                                <button onClick={stopAudio} style={{ background: "rgba(185,28,28,0.2)", border: "none", borderRadius: "50%", width: "22px", height: "22px", color: tp, cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="fas fa-stop" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ══ Settings Modal ══ */}
            {settingsOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }}>
                    <div style={{ width: "100%", maxWidth: "400px", margin: "0 16px", borderRadius: "16px", overflowY: "auto", maxHeight: "90vh", background: sBg, direction: "rtl" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                            <button onClick={() => setSettingsOpen(false)} style={{ color: ts, background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>{t.goBack}</button>
                            <h2 style={{ color: tp, fontWeight: "bold", fontSize: "18px" }}>{t.settingsTitle}</h2>
                        </div>
                        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>

                            {/* Assistant */}
                            <div style={{ background: rowBg, borderRadius: "12px", padding: "12px 16px" }}>
                                <p style={{ color: tp, fontSize: "14px", textAlign: "right", marginBottom: "10px" }}>{t.assistantLabel}</p>
                                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                    {[
                                        { k: "hamda", img: `/images/Sheikha-stop-${isDark ? "dark" : "white"}.gif`, name: lang === "ar" ? "شيخة" : "Sheikha", desc: t.assistantHamdaDesc },
                                        { k: "sakr",  img: `/images/hamad-stop-${isDark ? "dark" : "white"}.gif`,   name: lang === "ar" ? "حمد"  : "Hamad",   desc: t.assistantSakrDesc  },
                                    ].map(a => (
                                        <div key={a.k} onClick={() => setAiAssistant(a.k)}
                                            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 6px", borderRadius: "12px", cursor: "pointer", border: `2px solid ${aiAssistant === a.k ? "#b91c1c" : "transparent"}`, background: aiAssistant === a.k ? "rgba(185,28,28,0.15)" : "rgba(255,255,255,0.05)", transition: "all .2s" }}>
                                            <img src={a.img} alt={a.name} style={{ width: "70px", height: "70px", objectFit: "contain", borderRadius: "10px" }} />
                                            <span style={{ color: tp, fontSize: "13px", fontWeight: "bold" }}>{a.name}</span>
                                            <span style={{ color: tm, fontSize: "11px", textAlign: "center" }}>{a.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Theme */}
                            <SRow bg={rowBg} label={t.appearance} tc={tp}>
                                <BtnG opts={[{ k: "light", l: `☀️ ${t.light}` }, { k: "dark", l: `🌙 ${t.dark}` }]} val={theme} set={setTheme} />
                            </SRow>

                            {/* Lang */}
                            <SRow bg={rowBg} label={t.language} tc={tp}>
                                <BtnG opts={[{ k: "en", l: "🇺🇸 English" }, { k: "ar", l: "🇸🇦 العربية" }]} val={lang} set={setLang} />
                            </SRow>

                            {/* Brightness */}
                            <div style={{ background: rowBg, borderRadius: "12px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: tm, fontSize: "12px" }}>{brt}%</span>
                                    <span style={{ color: tp, fontSize: "14px" }}>{t.brightness}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ color: "#facc15", fontSize: "14px" }}>☀️</span>
                                    <input type="range" min="20" max="100" value={brt} style={{ flex: 1 }} onChange={e => setBrt(Number(e.target.value))} />
                                    <span style={{ color: tm, fontSize: "14px" }}>⚙️</span>
                                </div>
                            </div>

                            {/* Notif */}
                            <SRow bg={rowBg} label={t.notifications} tc={tp}>
                                <div className={`tgl ${notifOn ? "on" : "off"}`} onClick={() => setNotif(!notifOn)}><div className="knob" /></div>
                            </SRow>

                            {/* PIN */}
                            <div style={{ background: rowBg, borderRadius: "12px", padding: "12px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button onClick={openSetPin} style={{ background: "#b91c1c", color: "white", fontSize: "12px", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer" }}>{t.setPin}</button>
                                        {savedPin && <button onClick={deletePin} style={{ background: "rgba(255,255,255,0.1)", color: tp, fontSize: "12px", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer" }}>{t.deletePin}</button>}
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ color: tp, fontSize: "14px" }}>{t.pinSecurity}</span>
                                        <p style={{ color: tm, fontSize: "12px" }}>{savedPin ? t.pinActive : t.noPin}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Reminders */}
                            <div style={{ background: rowBg, borderRadius: "12px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <button onClick={() => setRFormOpen(!rFormOpen)} style={{ background: "#b91c1c", color: "white", fontSize: "12px", padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer" }}>{t.addReminder}</button>
                                    <span style={{ color: tp, fontSize: "14px" }}>{t.reminders}</span>
                                </div>
                                {rFormOpen && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        {[
                                            { val: rTitle, set: setRTitle, ph: t.reminderTitle, type: "text" },
                                            { val: rDate, set: setRDate, ph: "", type: "date" },
                                            { val: rTime, set: setRTime, ph: "", type: "time" },
                                        ].map((f, i) => (
                                            <input key={i} type={f.type} value={f.val} placeholder={f.ph} onChange={e => f.set(e.target.value)}
                                                style={{ width: "100%", background: "rgba(255,255,255,0.1)", color: tp, fontSize: "14px", borderRadius: "8px", padding: "8px 12px", outline: "none", border: "none", textAlign: "right" }} />
                                        ))}
                                        <textarea value={rNote} onChange={e => setRNote(e.target.value)} placeholder={t.reminderNote} rows={2}
                                            style={{ width: "100%", background: "rgba(255,255,255,0.1)", color: tp, fontSize: "14px", borderRadius: "8px", padding: "8px 12px", outline: "none", border: "none", textAlign: "right", resize: "none" }} />
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button onClick={saveRem} style={{ flex: 1, background: "#b91c1c", color: "white", fontSize: "14px", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer" }}>{t.save}</button>
                                            <button onClick={() => setRFormOpen(false)} style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: tp, fontSize: "14px", padding: "8px", borderRadius: "8px", border: "none", cursor: "pointer" }}>{t.cancel}</button>
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {reminders.map(r => (
                                        <div key={r.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "8px 12px", textAlign: "right", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <button onClick={() => delRem(r.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px", padding: "0 4px" }}>✕</button>
                                            <div>
                                                <p style={{ color: tp, fontSize: "14px", fontWeight: 500 }}>{r.title}</p>
                                                <p style={{ color: tm, fontSize: "12px" }}>{r.date} {r.time}{r.note ? ` — ${r.note}` : ""}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* ══ PIN Modal ══ */}
            {pinModalOpen && (
                <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.88)", direction: "rtl" }}>
                    <div className={shakePin ? "shk" : ""} style={{ background: ppBg, borderRadius: "16px", padding: "24px", width: "292px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            {pinMode !== "unlock"
                                ? <button onClick={closePin} style={{ color: tm, background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>✕</button>
                                : <div />}
                            <h3 style={{ color: tp, fontWeight: "bold" }}>{t.pinTitle}</h3>
                        </div>
                        <p style={{ textAlign: "center", color: ts, fontSize: "13px", marginBottom: "8px" }}>{pinLabel}</p>
                        {pinErr && <p style={{ textAlign: "center", color: "#ef4444", fontSize: "12px", marginBottom: "6px" }}>{pinErr}</p>}
                        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "22px" }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${i < dotsCount ? "#b91c1c" : "rgba(255,255,255,0.3)"}`, background: i < dotsCount ? "#b91c1c" : "transparent", transition: "all .15s" }} />
                            ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                <button key={n} onClick={() => pinPress(n)} style={{ background: pbBg, color: tp, fontWeight: 500, padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px" }}>{n}</button>
                            ))}
                            <button onClick={pinDel} style={{ background: pbBg, color: tp, padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px" }}>⌫</button>
                            <button onClick={() => pinPress(0)} style={{ background: pbBg, color: tp, fontWeight: 500, padding: "12px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px" }}>0</button>
                            <div />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function AnalogClock({ now, size = 180 }) {
    const cx = size / 2, cy = size / 2, r = size / 2 - 4;
    const h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds();

    const toRad = (a) => (a * Math.PI) / 180;
    const pt = (angleDeg, len) => ({
        x: cx + len * Math.cos(toRad(angleDeg)),
        y: cy + len * Math.sin(toRad(angleDeg)),
    });

    // Hands — no seconds
    const hAngle = (h * 60 + m) / 720  * 360 - 90;
    const mAngle = (m * 60 + s) / 3600 * 360 - 90;
    const hPt = pt(hAngle, r * 0.50);
    const mPt = pt(mAngle, r * 0.70);

    // 60 rectangular ticks around outer ring
    // Ticks 0..m are lit orange, rest are dim — creating a progress arc
    const tickW = size * 0.028;   // rect width
    const tickH  = size * 0.068;  // all same height
    const tickR  = r * 0.90;      // center radius of each rect

    const rects = Array.from({ length: 60 }, (_, i) => {
        const angleDeg = (i / 60) * 360 - 90;
        const c = pt(angleDeg, tickR);
        const lit = i < s;
        return { i, angleDeg, cx: c.x, cy: c.y, lit };
    });

    // Hour numbers inside
    const nums = [12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
        const a = (i / 12) * 360 - 90;
        const p = pt(a, r * 0.63);
        return { n, x: p.x, y: p.y };
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
            style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.6))" }}>

            {/* Background */}
            <circle cx={cx} cy={cy} r={r} fill="#111"/>
            {/* Inner face */}
            <circle cx={cx} cy={cy} r={r * 0.72} fill="#1a1a1a" stroke="rgba(180,83,9,0.2)" strokeWidth="1"/>

            {/* Rectangular ticks — lit ones are orange, unlit are very dim */}
            {rects.map(({ i, angleDeg, cx: rx, cy: ry, lit }) => (
                <rect key={i}
                    x={rx - tickW / 2} y={ry - tickH / 2}
                    width={tickW} height={tickH}
                    rx={tickW / 2}
                    fill={lit ? "#f59e0b" : "rgba(255,255,255,0.08)"}
                    style={lit ? { filter: "drop-shadow(0 0 3px rgba(245,158,11,0.6))" } : {}}
                    transform={`rotate(${angleDeg + 90}, ${rx}, ${ry})`}
                />
            ))}

            {/* Hour numbers */}
            {nums.map(({ n, x, y }) => (
                <text key={n} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                    fontSize={size * 0.068} fill="#d97706" fontWeight="bold"
                    fontFamily="'Segoe UI',sans-serif">
                    {n}
                </text>
            ))}

            {/* Brand */}
            <text x={cx} y={cy + r * 0.28} textAnchor="middle"
                fontSize={size * 0.065} fill="rgba(217,119,6,0.65)"
                fontFamily="'Segoe UI',sans-serif" letterSpacing="2">
                قمرة
            </text>

            {/* Hour hand */}
            <line x1={cx} y1={cy} x2={hPt.x} y2={hPt.y}
                stroke="white" strokeWidth={size * 0.032} strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}/>
            {/* Minute hand */}
            <line x1={cx} y1={cy} x2={mPt.x} y2={mPt.y}
                stroke="#f59e0b" strokeWidth={size * 0.020} strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 6px rgba(245,158,11,0.7))" }}/>

            {/* Center cap */}
            <circle cx={cx} cy={cy} r={size * 0.035} fill="#f59e0b"/>
            <circle cx={cx} cy={cy} r={size * 0.014} fill="#111"/>
        </svg>
    );
}

function SRow({ bg, label, tc, children }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: bg, borderRadius: "12px", padding: "12px 16px" }}>
            {children}
            <span style={{ color: tc, fontSize: "14px" }}>{label}</span>
        </div>
    );
}

function BtnG({ opts, val, set }) {
    return (
        <div style={{ display: "flex", gap: "8px" }}>
            {opts.map(o => (
                <button key={o.k} onClick={() => set(o.k)} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer", background: val === o.k ? "#b91c1c" : "transparent", color: val === o.k ? "white" : "rgba(255,255,255,0.5)" }}>
                    {o.l}
                </button>
            ))}
        </div>
    );
}