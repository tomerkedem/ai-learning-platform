// i18n/locales/ja/behind-ai/attention.ts
// Japanese Chapter 6 ("Attention"). Fallback: re-exports the Hebrew source so the shape
// stays identical and every route renders. Real Japanese translation is a later pass;
// until then this locale falls back to the canonical Hebrew content. The dict's
// contentLocale stays 'he', so read-aloud speaks the fallback text as Hebrew.
export { attention } from '../../he/behind-ai/attention';
