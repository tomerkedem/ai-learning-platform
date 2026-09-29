// מפתחות התשובה של הפרקים המוגנים (בדיקת ההבנה בתוך הפרק, האבחון, ניחוש הפתיחה),
// בשרת בלבד. עמוד מוגן מעביר ללקוח רק את המפתחות של הפרק שלו, אחרי בדיקת הרשאה
// (openCourseContent). guessTones: 'precise' / 'close' מסמנים את הניחוש המדויק.
// אין שימוש בתו "מקף ארוך" (em dash).

import 'server-only';
import type { AnswerKeys } from '@/i18n/ProtectedContent';

export const ANSWER_KEYS: Record<number, AnswerKeys> = {
    "2": {
        "diag": 0,
        "guessTones": {
            "intention": "common",
            "text": "precise",
            "answer": "layer",
            "important": "partial"
        }
    },
    "3": {
        "lock": 4,
        "guessTones": {
            "as-is": "common",
            "tokens": "precise",
            "meaning": "layer",
            "important": "partial"
        }
    },
    "4": {
        "lock": 0,
        "guessCorrect": "address"
    },
    "5": {
        "lock": 1,
        "guessTones": {
            "arrived": "common",
            "delayed": "precise",
            "checking": "partial",
            "recipe": "layer"
        }
    },
    "6": {
        "lock": 1,
        "guessTones": {
            "one-word": "partial",
            "highlight": "common",
            "dynamic": "close",
            "factcheck": "layer"
        }
    },
    "7": {
        "lock": 2,
        "guessTones": {
            "remembers-all": "common",
            "in-window": "close",
            "first-message": "partial",
            "saved-memory": "layer"
        }
    },
    "8": {
        "lock": 2,
        "guessTones": {
            "delayed": "close",
            "delivered": "partial",
            "pickup": "layer",
            "lost": "common"
        }
    },
    "9": {
        "lock": 2,
        "guessTones": {
            "alwaysTop": "partial",
            "conservative": "close",
            "sampled": "layer",
            "autoTrue": "common"
        }
    },
    "10": {
        "lock": 1,
        "guessTones": {
            "ready": "common",
            "loop": "precise",
            "verify": "layer",
            "last-word": "partial"
        }
    },
    "11": {
        "lock": 1,
        "guessTones": {
            "plausible": "precise",
            "confidentTrue": "common",
            "dateChecked": "layer",
            "longerBetter": "partial"
        }
    },
    "12": {
        "lock": 1,
        "guessTones": {
            "grounded": "precise",
            "smarter": "common",
            "knowsAll": "layer",
            "autoTrue": "partial"
        }
    },
    "13": {
        "lock": 1,
        "guessTones": {
            "check": "precise",
            "send": "common",
            "add": "layer",
            "replace": "partial"
        }
    },
    "14": {
        "lock": 1,
        "guessTones": {
            "context": "precise",
            "permanent": "common",
            "everyone": "layer",
            "nothing": "partial"
        }
    },
    "15": {
        "lock": 1,
        "guessTones": {
            "alwaysRight": "common",
            "generalizes": "precise",
            "memorized": "layer",
            "noNeed": "partial"
        },
        "scoreGuess": 2,
        "scoreLock": 1
    },
    "16": {
        "lock": 1,
        "guessTones": {
            "alwaysRemembers": "common",
            "contextNotPermanent": "precise",
            "cantUseAtAll": "layer",
            "everyoneGetsIt": "partial"
        }
    },
    "17": {
        "lock": 1,
        "guessTones": {
            "becomesTask": "precise",
            "alwaysChat": "common",
            "justLonger": "partial",
            "alwaysAutonomous": "layer"
        }
    },
    "18": {
        "lock": 1,
        "guessTones": {
            "needsApproval": "precise",
            "canSend": "common",
            "alwaysAlone": "layer",
            "neverTools": "partial"
        }
    },
    "19": {
        "lock": 1,
        "guessTones": {
            "fullRoute": "precise",
            "oneAnswer": "common",
            "agentSends": "layer",
            "noChecks": "partial"
        }
    }
};
