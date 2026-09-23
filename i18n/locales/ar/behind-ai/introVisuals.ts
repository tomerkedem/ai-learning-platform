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
        demo: {
            start: 'وضع العرض',
            exit: 'إنهاء العرض',
            prev: 'السابق',
            next: 'التالي',
            counter: (n: number, total: number) => `المحطة ${n} من ${total}`,
        },
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
            mix: 'يُرسَل كل توكن إلى الخبراء. يضيء بعضهم فقط من بين كثيرين - هكذا يبقى النموذج الضخم سريعًا.',
            layers: 'كل طبقة تعيد تشغيل الانتباه و-feed-forward وتصقل أكثر قليلًا. في نموذج حقيقي عشرات منها.',
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
            userText: 'ماذا يمكنني أن أحضّر للعشاء؟',
            systemLabel: 'تعليمات النظام',
            systemText: 'أنتم مساعد طهي. قدّموا اقتراحات عملية ومختصرة.',
            historyLabel: 'المحادثة حتى الآن',
            historyText: 'ذكرت سابقًا أن لديّ في البيت معكرونة وطماطم.',
            stripLabel: 'كل شيء يدخل كسلسلة واحدة',
            caption: 'التعليمات والمحادثة والطلب تلتصق في سلسلة واحدة طويلة، ولذلك تؤثر كلها في الإجابة.',
        },

        tokenize: {
            sentence: 'قطتي نائمة على الأريكة',
            tokens: ['قطتي', 'نائمة', 'على', 'الأريكة'] as string[],
            caption: 'في نموذج حقيقي قد يقع التقسيم أحيانًا داخل الكلمة، لا بين الكلمات فقط.',
            altSentence: 'الاجتماعات المطولة',
            altTokens: ['الاجتماع', 'ات', 'المطول', 'ة'] as string[],
            // Maps each piece to its original word (same-word pieces share a color).
            altGroups: [0, 0, 1, 1] as number[],
            altCaption: 'الأجزاء بنفس اللون كانت كلمة واحدة. النموذج يعمل أيضًا على أجزاء الكلمات.',
            variantA: 'جملة بسيطة',
            variantB: 'كلمات طويلة',
        },

        ids: {
            hint: 'اضغطوا على بطاقة لقلبها',
            caption: 'المعرّف عنوان في المعجم، لا معنى.',
        },

        embedding: {
            token: 'قطة',
            caption: (note: string) =>
                `يصبح الرمز معرّفًا في المفردات، ثم متجهًا من الأرقام يرمّز المعنى. ${note}`,
            // Fixed order across locales (vector numbers are mapped by index): 0 cat, 1 dog, 2 car, 3 bicycle.
            mapWords: ['قطة', 'كلب', 'سيارة', 'دراجة'] as string[],
            mapHint: 'اضغطوا على كلمة في الخريطة',
            nearLabel: 'الزوج الأقرب',
            mapCaption: 'التمثيلات ذات المعنى المتقارب يمكن أن تقع قريبة من بعضها في الفضاء.',
        },

        position: {
            tokens: ['أولاً', 'مطر', 'ثم', 'شمس'] as string[],
            swapLabel: 'بدّلوا الترتيب',
            meaningA: 'يهطل المطر أولاً، ثم تصفو السماء.',
            meaningB: 'تشرق الشمس أولاً، ثم يهطل المطر.',
            caption: 'وسم الموقع هو ما يفصل هنا بين "قبل" و"بعد".',
        },

        context: {
            windowLabel: 'نافذة السياق',
            outLabel: 'خارج النافذة',
            addLabel: 'تصل رسالة جديدة',
            messages: [
                'عيد ميلاد صديقي يوم السبت',
                'تمام، جيد أن أعرف!',
                'ماذا يمكنني أن أشتري له كهدية؟',
                'ربما كتابًا أو نبتة',
                'لم أقرر بعد',
                'لحظة، في أي يوم كان عيد ميلاد صديقي؟',
            ] as string[],
            caption: 'النافذة لا تكبر: كل رسالة جديدة تدخل تدفع رسالة قديمة إلى الخارج.',
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
            caption: 'كل كلمة تنتبه إلى الأخريات بقوة مختلفة.',
        },

        // Station 8: two different tokens, each routed to different experts.
        mix: {
            tokenA: 'وصفة',
            tokenB: 'طقس',
            routerLabel: 'الراوتر يختار',
            activeNote: (k: number, n: number) => `${k} من ${n} خبراء يعملون`,
            outLabel: 'مُثرى',
            hint: 'بدّل التوكن وشاهد أيّ خبراء يضيئون',
            caption: 'بعد الانتباه، يمرّ كل توكن عبر شبكة feed-forward تُثريه. في النماذج الكبيرة يعمل هذا بأسلوب Mixture-of-Experts: معرفة هائلة، لكن جزءًا صغيرًا فقط يعمل لكل توكن. "الخبراء" ليسوا خبراء بشريين في مواضيع: التوجيه يُتعلَّم أثناء التدريب، وهو رقمي بالكامل، ولا يمكن قراءته مباشرة.',
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
            blockLabel: 'كل طبقة: انتباه + feed-forward',
            hint: 'اضغطوا على طابق للانتقال إليه',
            caption: 'لا طبقة واحدة تفهم بمفردها: الكتلة نفسها تتكرر، والفهم يُبنى تدريجيًا.',
        },

        state: {
            orbLabel: 'تمثيل واحد لكل السياق',
            insideBtn: 'ماذا انضغط في الداخل؟',
            caption: 'السياق نفسه لا يُمحى: في كل دورة يعود النموذج وينظر إليه من جديد.',
        },

        logits: {
            prompt: 'غدًا سيكون الطقس...',
            words: ['مشمسًا', 'ممطرًا', 'غائمًا', 'حارًا', 'باردًا', 'لطيفًا', 'عاصفًا', 'صافيًا'] as string[],
            note: 'ثمانية مرشحين من بين عشرات الآلاف تُفحص دفعة واحدة.',
            caption: (note: string) =>
                `الدرجة الأعلى تقول "أرجح" فقط، لا "بكم أرجح". ${note}`,
        },

        scores: {
            rowLabels: ['شمس', 'مطر', 'غيم'] as string[],
            rawHeader: 'درجة خام',
            probHeader: 'الاحتمال',
            totalLabel: 'معًا',
            caption: (note: string) =>
                `حتى بعد التحويل، هذا لا يزال توزيعًا، لا قرارًا. ${note}`,
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
            caption: 'لهذا تُبنى إجابة الدردشة أمام أعينكم، كلمة بعد كلمة.',
        },
    },
};
