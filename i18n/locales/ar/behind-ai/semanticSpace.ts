// i18n/locales/ar/behind-ai/semanticSpace.ts
// Arabic Chapter 5 ("Semantic Space"), Modern Standard Arabic, RTL.
// Narrow localization: the "in simple words" explanatory card (plain) is fully translated
// to MSA. Every other field still falls back to the Hebrew source until Chapter 5 is
// translated in full, so we spread `he` and override only `plain`.
import { semanticSpace as he } from '../../he/behind-ai/semanticSpace';

export const semanticSpace = {
    ...he,
    plain: {
        eyebrow: 'بكلمات بسيطة',
        title: 'ما هو فضاء المعنى',
        paragraphs: [
            'بعد أن تحوّلت كل جملة إلى قائمة من الأرقام، صار بإمكاننا مقارنة الجمل بالأرقام بدل الكلمات. يقيس النموذج مدى تشابه قائمتين كهاتين، ويرتّب الجمل بحيث تقترب من بعضها تلك التي تشترك في أنماط تعلّمها. وهذا ما يتيح له ترتيب الجمل وإيجاد الأقرب إليها في المعنى، حتى عندما لا تشترك في أي كلمة.',
            'القرب يعني أن النموذج تعلّم علاقة بين الجمل، والبعد يعني أن هذه العلاقة ضعيفة. لكن القرب مجرد دليل على علاقة متعلَّمة، وليس برهانًا على أن المعنيين متطابقان. كما أن الخريطة هنا ليست سوى صورة مبسّطة ثنائية الأبعاد لفضاء ذي محاور أكثر بكثير، رُسمت كي نتمكّن من رؤيته بأعيننا.',
        ],
    },
};
