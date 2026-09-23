import type { Metadata } from "next";
import Link from "next/link";
import { RootDocument } from "@/components/RootDocument";
import { DEFAULT_LOCALE } from "@/i18n/config";

// 404 לכתובת שאינה קיימת. נדרש כי לאתר שני root layouts - app/(site) ו-app/(course) - ואין
// layout עליון שממנו אפשר להרכיב דף 404. סטטי ובעברית + אנגלית, כמו global-error.
export const metadata: Metadata = {
  title: "404",
};

export default function GlobalNotFound() {
  return (
    <RootDocument locale={DEFAULT_LOCALE}>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">הדף לא נמצא / Page not found</h1>
        <Link href="/" className="rounded-lg border border-current px-5 py-2 font-semibold">
          לדף הבית / Home
        </Link>
      </main>
    </RootDocument>
  );
}
