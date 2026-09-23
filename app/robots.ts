import type { MetadataRoute } from "next";

// אין דומיין ייצור מוגדר, ולכן אין שדה sitemap (דורש כתובת מוחלטת).
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
