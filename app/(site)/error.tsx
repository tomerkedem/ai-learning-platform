"use client";

import Link from "next/link";
import { useT } from "@/i18n/useT";
import type { Locale } from "@/i18n/config";

const COPY: Record<Locale, { title: string; body: string; retry: string; home: string }> = {
  he: { title: "משהו השתבש", body: "אירעה תקלה בלתי צפויה. ההתקדמות השמורה שלך לא נפגעה.", retry: "נסו שוב", home: "לדף הבית" },
  en: { title: "Something went wrong", body: "An unexpected error occurred. Your saved progress is safe.", retry: "Try again", home: "Back to home" },
  es: { title: "Algo salió mal", body: "Ocurrió un error inesperado. Tu progreso guardado está a salvo.", retry: "Intentar de nuevo", home: "Volver al inicio" },
  ru: { title: "Что-то пошло не так", body: "Произошла непредвиденная ошибка. Ваш сохранённый прогресс в безопасности.", retry: "Повторить", home: "На главную" },
  ar: { title: "حدث خطأ ما", body: "وقع خطأ غير متوقع. تقدّمك المحفوظ بأمان.", retry: "حاول مرة أخرى", home: "إلى الصفحة الرئيسية" },
  ja: { title: "問題が発生しました", body: "予期しないエラーが発生しました。保存済みの進捗は失われていません。", retry: "もう一度試す", home: "ホームへ戻る" },
};

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale, dir } = useT();
  const c = COPY[locale];
  return (
    <main dir={dir} className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">{c.title}</h1>
      <p className="max-w-md opacity-80">{c.body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="rounded-lg bg-indigo-600 px-5 py-2 font-semibold text-white">
          {c.retry}
        </button>
        <Link href="/" className="rounded-lg border border-current px-5 py-2 font-semibold">{c.home}</Link>
      </div>
    </main>
  );
}
