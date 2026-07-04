// i18n/locales/ar/behind-ai/attention.ts
// Arabic Chapter 6 ("Attention"). Fallback: re-exports the Hebrew source so the shape
// stays identical and every route renders. Real Arabic translation is a later pass;
// until then this locale falls back to the canonical Hebrew content. The dict's
// contentLocale stays 'he', so read-aloud speaks the fallback text as Hebrew.
export { attention } from '../../he/behind-ai/attention';
