// i18n/locales/ru/behind-ai/attention.ts
// Russian Chapter 6 ("Attention"). Fallback: re-exports the Hebrew source so the shape
// stays identical and every route renders. Real Russian translation is a later pass;
// until then this locale falls back to the canonical Hebrew content. The dict's
// contentLocale stays 'he', so read-aloud speaks the fallback text as Hebrew.
export { attention } from '../../he/behind-ai/attention';
