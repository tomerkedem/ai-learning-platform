import type { MetadataRoute } from "next";
import { courses } from "@/lib/courseData";

// דורש כתובות מוחלטות. עד שיוגדר דומיין ייצור (SITE_URL), ה-sitemap ריק ולא ממציאים כתובת.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL?.replace(/\/$/, "");
  if (!base) return [];
  const paths = Object.values(courses).flatMap((c) => c.chapters.map((ch) => ch.href).filter((h): h is string => !!h));
  return ["/", ...paths].map((p) => ({ url: base + p }));
}
