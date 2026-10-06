// Ownership rules for the course-level keyboard shortcuts in ChapterLayout (Left/Right between chapters,
// Escape out of Focus Mode). A page shortcut fires only when nothing closer owns the key: no open modal,
// no editable field, and for the arrows no control or composite widget. Pure over a minimal DOM shape
// so the rules are testable in node.

type KeyTarget = { closest(selectors: string): unknown; isContentEditable?: boolean };
type ModalDocument = { querySelector(selectors: string): unknown };

// A native <dialog>, an ARIA dialog or the fullscreen lab (role="dialog" aria-modal="true").
const MODAL = 'dialog, [role="dialog"], [role="alertdialog"], [aria-modal="true"]';
const OPEN_MODAL = 'dialog[open], [aria-modal="true"]';
const EDITABLE = 'input, textarea, select';

// Native controls and ARIA widgets whose arrow keys belong to them, plus an explicit opt-out
// (data-owns-keys) for a region that handles arrows without one of these semantics.
const ARROW_OWNERS = [
    'input', 'textarea', 'select', 'button', 'a[href]', 'summary', 'audio', 'video', '[data-owns-keys]',
    ...['button', 'link', 'tab', 'tablist', 'slider', 'spinbutton', 'listbox', 'option', 'combobox',
        'menu', 'menubar', 'menuitem', 'menuitemradio', 'menuitemcheckbox', 'radiogroup', 'radio',
        'grid', 'gridcell', 'treegrid', 'tree', 'treeitem', 'toolbar', 'application',
    ].map((role) => `[role="${role}"]`),
].join(', ');

function modalOwnsKeys(target: KeyTarget | null, doc: ModalDocument) {
    return !!doc.querySelector(OPEN_MODAL) || !!target?.closest(MODAL);
}

function isEditable(target: KeyTarget | null) {
    return !!target?.isContentEditable || !!target?.closest(EDITABLE);
}

/** Escape may exit Focus Mode: not while typing, and never behind a modal (the modal owns Escape). */
export function pageEscapeAllowed(target: KeyTarget | null, doc: ModalDocument) {
    return !modalOwnsKeys(target, doc) && !isEditable(target);
}

/** Left/Right may change chapter only from neutral page content. Same rule in RTL and LTR. */
export function pageArrowsAllowed(target: KeyTarget | null, doc: ModalDocument) {
    return !modalOwnsKeys(target, doc) && !isEditable(target) && !target?.closest(ARROW_OWNERS);
}
