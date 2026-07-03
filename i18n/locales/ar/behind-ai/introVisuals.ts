// i18n/locales/ar/behind-ai/introVisuals.ts
// Arabic (Modern Standard Arabic) introduction visual/UI strings.
// Shape source: ../../he/behind-ai/introVisuals.
//
// Display text only. Structural values (numbers, vectors, indices, map positions)
// stay in the components. Fixed index contracts: attention tokens (0 = noun,
// 3 = pronoun, 4 = state), position tokens (indices 1 and 3 swap), embedding
// mapWords (0+1 close pair, 2+3 close pair), context messages (chronological).
// "AI" is kept in Latin to match the catalog. No em dash (U+2014), no en dash
// (U+2013), no Hebrew characters.

export const introVisuals = {
    roadmap: {
        peek: 'نظرة',
        zone: 'منطقة',
        loopBadge: 'يعود إلى بداية المسار',
    },

    systems: {
        act: 'مرحلة',
        chapter: 'فصل',
    },

    guess: {
        tokenCue: ['تو', 'كن'] as string[],
    },

    viz: {
        sharedNote: 'الأرقام للتوضيح فقط، وليست مخرجات حقيقية لنموذج.',
        replay: 'إعادة التشغيل',
        soundOn: 'تشغيل الأصوات',
        soundOff: 'كتم الأصوات',

        // جملة مرشد قصيرة لكل محطة: زاوية تضيف إلى الشرح الموجود على البطاقة.
        mentorHints: {
            request: 'انتبهوا: النموذج لا يرى رسالتكم وحدها أبدًا. كل شيء يدخل معًا.',
            tokenize: 'انظروا كيف تُقطَّع الجملة. لم تعد لغة، بل قطعًا.',
            ids: 'من هنا فصاعدًا لا كلمات في الداخل، أرقام فقط.',
            embedding: 'الأرقام ليست عشوائية: الكلمات المتشابهة تحصل على أرقام متشابهة.',
            position: 'الكلمات نفسها بترتيب آخر تغيّر كل شيء. لذلك يُحفَظ الترتيب.',
            context: 'ما يخرج من النافذة يُنسى. هكذا تفقد محادثة طويلة بدايتها.',
            attention: 'كل كلمة تصغي إلى الأخريات. المسوا كلمة لتروا بمن ترتبط.',
            mix: 'الكلمة نفسها، سياق آخر، معنى آخر.',
            layers: 'كل طبقة تصقل أكثر قليلًا. في نموذج حقيقي عشرات منها.',
            state: 'كل السياق مضغوط في نقطة واحدة. منها تولد الكلمة التالية.',
            logits: 'يزن النموذج كلمات كثيرة دفعة واحدة ويمنح كلًّا منها درجة.',
            softmax: 'الدرجات تتحول إلى نسب مجموعها مئة.',
            decoding: 'التوزيع نفسه، اختيار آخر. لذلك تفاجئ الإجابة أحيانًا.',
            loop: 'يُختار رمز، ويعمل كل شيء من جديد. هكذا تُبنى إجابة كاملة.',
        },

        request: {
            youTab: 'ما ترونه أنتم',
            modelTab: 'ما يستقبله النموذج',
            userLabel: 'رسالتكم',
            userText: 'أين طردي؟',
            systemLabel: 'تعليمات النظام',
            systemText: 'أنتم وكيل دعم. تحققوا من حالة الشحنة قبل الرد.',
            historyLabel: 'المحادثة حتى الآن',
            historyText: 'طلبت أمس وحصلت على رقم تتبع.',
            stripLabel: 'كل شيء يدخل كسلسلة واحدة',
            caption: 'النموذج لا يستقبل رسالتكم الأخيرة فقط: التعليمات والمحادثة والطلب تلتصق في سلسلة واحدة طويلة.',
        },

        tokenize: {
            sentence: 'طردي لم يصل بعد',
            tokens: ['طردي', 'لم', 'يصل', 'بعد'] as string[],
            caption: 'يُقسَّم النص إلى وحدات. في نموذج حقيقي قد يقع التقسيم أحيانًا داخل الكلمة.',
            altSentence: 'الشحنات المتأخرة',
            altTokens: ['الشحن', 'ات', 'المتأخر', 'ة'] as string[],
            // Maps each piece to its original word (same-word pieces share a color).
            altGroups: [0, 0, 1, 1] as number[],
            altCaption: 'الأجزاء بنفس اللون كانت كلمة واحدة. النموذج يعمل أيضًا على أجزاء الكلمات.',
            variantA: 'جملة بسيطة',
            variantB: 'كلمات طويلة',
        },

        ids: {
            hint: 'اضغطوا على بطاقة لقلبها',
            caption: 'من هنا فصاعدًا لا كلمات في الداخل. أرقام فقط.',
        },

        embedding: {
            token: 'طردي',
            caption: (note: string) =>
                `يصبح الرمز معرّفًا في المفردات، ثم متجهًا من الأرقام يرمّز المعنى. ${note}`,
            // Fixed order across locales (vector numbers are mapped by index): 0 package, 1 delivery, 2 cat, 3 dog.
            mapWords: ['طرد', 'شحنة', 'قطة', 'كلب'] as string[],
            mapHint: 'اضغطوا على كلمة في الخريطة',
            nearLabel: 'الزوج الأقرب',
            mapCaption: 'الكلمات المتشابهة في المعنى تحصل على أرقام متشابهة، فتهبط قريبة من بعضها.',
        },

        position: {
            tokens: ['أولاً', 'الدفع', 'ثم', 'التوصيل'] as string[],
            swapLabel: 'بدّلوا الترتيب',
            meaningA: 'تدفعون قبل خروج الطرد.',
            meaningB: 'تدفعون فقط بعد وصول الطرد.',
            caption: 'الكلمات نفسها تمامًا، ترتيب آخر، صفقة أخرى. لهذا يحصل كل رمز على وسم موقع.',
        },

        context: {
            windowLabel: 'نافذة السياق',
            outLabel: 'خارج النافذة',
            addLabel: 'تصل رسالة جديدة',
            messages: [
                'طلبت مكنسة لاسلكية',
                'تم استلام الطلب، شكرًا!',
                'متى يصل الشحن؟',
                'شحنتكم تخرج اليوم',
                'الطرد لم يصل بعد',
                'ماذا طلبتم بالضبط؟',
            ] as string[],
            caption: 'ما يخرج من النافذة لا وجود له بالنسبة للنموذج. لهذا قد تنسى محادثة طويلة بدايتها.',
        },

        // stories order must match the tokens order (index for index).
        attention: {
            tokens: ['الكلب', 'ركض', 'لأن', 'هو', 'سعيد'] as string[],
            strongLabel: 'رابط قوي',
            weakLabel: 'ضعيف',
            stories: [
                '"الكلب" يرتبط أولاً بـ"ركض": من يقوم بالفعل.',
                '"ركض" يبحث عمّن ركض، فيرتبط بـ"الكلب".',
                '"لأن" تصل السبب: ترتبط بـ"سعيد".',
                'من هو "هو"؟ يربطه النموذج بـ"الكلب".',
                'من السعيد؟ "سعيد" ترتبط بـ"هو"، أي الكلب.',
            ] as string[],
            caption: 'اضغطوا على كلمة لتغيير البؤرة. كل كلمة تنتبه إلى الأخريات بقوة مختلفة.',
        },

        // Station 8: one ambiguous word, two contexts, the meaning flips.
        mix: {
            word: 'طلب',
            aLabel: 'وصل طلبي من المتجر',
            aSource: 'من المتجر',
            aMeaning: 'منتج اشتريتموه وهو في الطريق',
            bLabel: 'قدّمت طلبًا للجامعة',
            bSource: 'للجامعة',
            bMeaning: 'التماس رسمي مكتوب',
            caption: 'دخلت الكلمة متطابقة في الجملتين. امتزجت معلومات الجيران في تمثيلها، فخرجت بمعنى مختلف.',
        },

        layers: {
            sentence: 'ركض الكلب لأنه سعيد',
            floors: ['الكلمات والقواعد', 'من يشير إلى من', 'القصد والمعنى'] as string[],
            notes: [
                'يرصد النموذج البنية: من يفعل ماذا.',
                'يربط النموذج: "هو" يعني الكلب.',
                'يلتقط النموذج السبب: السعادة تفسّر الركض.',
            ] as string[],
            floorLabel: 'طابق',
            hint: 'اضغطوا على طابق للانتقال إليه',
            caption: 'في نموذج حقيقي عشرات الطوابق كهذه، وكل واحد يصقل الفهم أكثر قليلًا.',
        },

        state: {
            orbLabel: 'تمثيل واحد لكل السياق',
            insideBtn: 'ماذا انضغط في الداخل؟',
            caption: 'كل السياق مضغوط في نقطة واحدة. منها ستولد الكلمة التالية.',
        },

        logits: {
            prompt: 'غدًا سيكون الطقس...',
            words: ['مشمسًا', 'ممطرًا', 'غائمًا', 'حارًا', 'باردًا', 'لطيفًا', 'عاصفًا', 'صافيًا'] as string[],
            note: 'ثمانية مرشحين من بين عشرات الآلاف تُفحص دفعة واحدة.',
            caption: (note: string) =>
                `كل مرشح يحصل على درجة خام، وتترتب القائمة حسب المتصدر. ${note}`,
        },

        scores: {
            rowLabels: ['شمس', 'مطر', 'غيم'] as string[],
            rawHeader: 'درجة خام',
            probHeader: 'الاحتمال',
            totalLabel: 'معًا',
            caption: (note: string) =>
                `الدرجات الخام (الرمادي) تتحول إلى احتمالات مجموعها 100%. ${note}`,
        },

        decoding: {
            prompt: 'غدًا سيكون',
            sure: 'الوضع الآمن',
            surprise: 'وضع المفاجأة',
            roll: 'اختاروا الكلمة التالية',
            tally: 'النتائج حتى الآن',
            sureNote: 'في الوضع الآمن تفوز دائمًا الكلمة المتصدرة. نفس السؤال، نفس الجواب.',
            surpriseNote: 'في وضع المفاجأة تفوز أحيانًا كلمة أقل احتمالًا. لهذا قد يحصل نفس السؤال على أجوبة مختلفة.',
        },

        loop: {
            words: ['اليوم', 'سيكون', 'الطقس', 'مشمسًا', 'ولطيفًا', 'نسبيًا'] as string[],
            play: 'تابعوا',
            pause: 'إيقاف مؤقت',
            tokenLabel: 'رمز',
            stopLabel: 'إشارة التوقف',
            caption: 'كل دورة تضيف رمزًا واحدًا إلى الإجابة. لهذا تُبنى إجابة الدردشة أمام أعينكم، كلمة بعد كلمة.',
        },
    },
};
