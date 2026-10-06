// Course keyboard shortcut ownership: page-level Left/Right and Escape never fire from a field, a control,
// a composite widget or a modal. The predicates run against a tiny element tree; source contracts pin the
// wiring in ChapterLayout, the fullscreen lab and the Chapter 10 tab widget.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pageArrowsAllowed, pageEscapeAllowed } from "./courseShortcuts.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = (...rel: string[]) => readFileSync(join(HERE, ...rel), "utf8");

// Minimal element: tag + attributes + parent, with closest() for the simple selectors the module uses
// (tag, [attr], [attr="v"], tag[attr], tag[attr="v"]).
type Node = { tag: string; attrs: Record<string, string>; parent: Node | null; isContentEditable?: boolean; closest(s: string): Node | null };
const matches = (n: Node, sel: string) => {
    const m = /^([a-z]*)(?:\[([\w-]+)(?:="([^"]*)")?\])?$/.exec(sel.trim());
    assert.ok(m, `unsupported selector in test DOM: ${sel}`);
    const [, tag, attr, value] = m;
    if (tag && n.tag !== tag) return false;
    if (attr && !(attr in n.attrs)) return false;
    return value === undefined || n.attrs[attr] === value;
};
function el(tag: string, attrs: Record<string, string> = {}, parent: Node | null = null, isContentEditable = false): Node {
    const node: Node = {
        tag, attrs, parent, isContentEditable,
        closest(selectors) {
            for (let n: Node | null = node; n; n = n.parent) if (selectors.split(",").some((s) => matches(n!, s))) return n;
            return null;
        },
    };
    return node;
}
const noModal = { querySelector: () => null };
const modalOpen = { querySelector: (s: string) => (s.includes("aria-modal") ? {} : null) };

const body = el("body");
const main = el("main", { id: "chapter-main", tabindex: "-1" }, body);
const paragraph = el("p", {}, main);

test("Left/Right navigate from neutral page content", () => {
    for (const target of [null, body, main, paragraph]) assert.equal(pageArrowsAllowed(target, noModal), true);
});

test("editable controls own arrows, Escape and typing", () => {
    for (const tag of ["input", "textarea", "select"]) {
        const field = el(tag, {}, main);
        assert.equal(pageArrowsAllowed(field, noModal), false, tag);
        assert.equal(pageEscapeAllowed(field, noModal), false, tag);
    }
    const rich = el("div", { contenteditable: "" }, main, true);
    assert.equal(pageArrowsAllowed(rich, noModal), false, "contenteditable");
    assert.equal(pageEscapeAllowed(rich, noModal), false, "contenteditable");
});

test("controls and composite widgets own Left/Right", () => {
    const owners: [string, Record<string, string>][] = [
        ["button", {}], ["a", { href: "/x" }], ["summary", {}],
        ...["tab", "tablist", "slider", "spinbutton", "listbox", "option", "menu", "menuitem", "combobox",
            "radiogroup", "radio", "grid", "gridcell", "tree", "treeitem", "button"].map((role): [string, Record<string, string>] => ["div", { role }]),
        ["section", { "data-owns-keys": "" }],
    ];
    for (const [tag, attrs] of owners) {
        const owner = el(tag, attrs, main);
        const inner = el("span", {}, owner);
        assert.equal(pageArrowsAllowed(owner, noModal), false, `${tag} ${JSON.stringify(attrs)}`);
        assert.equal(pageArrowsAllowed(inner, noModal), false, `inside ${tag} ${JSON.stringify(attrs)}`);
    }
});

test("Chapter 10 tab widget: arrows from a tab never change chapter, in RTL or LTR", () => {
    const lab = source("ai-internals", "GenerationLoopLab.tsx");
    assert.match(lab, /role="tablist"/);
    assert.match(lab, /role="tab"\s/);
    for (const dir of ["rtl", "ltr"]) {
        const tablist = el("div", { role: "tablist" }, el("div", { dir }, main));
        const tab = el("button", { type: "button", role: "tab", "aria-selected": "true" }, tablist);
        assert.equal(pageArrowsAllowed(tab, noModal), false, dir);
    }
});

test("a modal owns every key: no chapter change and no Focus Mode change behind it", () => {
    const dialog = el("div", { role: "dialog", "aria-modal": "true" }, body);
    const labButton = el("button", {}, dialog);
    const labText = el("p", {}, dialog);
    for (const target of [dialog, labButton, labText]) {
        assert.equal(pageArrowsAllowed(target, noModal), false);
        assert.equal(pageEscapeAllowed(target, noModal), false, "Escape stays with the modal");
    }
    // Focus fell back to body while a modal is open (or the dialog was just removed): still blocked.
    assert.equal(pageArrowsAllowed(body, modalOpen), false);
    assert.equal(pageEscapeAllowed(body, modalOpen), false);
    const native = el("dialog", { open: "" }, body);
    assert.equal(pageArrowsAllowed(el("button", {}, native), noModal), false, "native <dialog>");
});

test("Escape exits Focus Mode from neutral content and from ordinary buttons", () => {
    assert.equal(pageEscapeAllowed(paragraph, noModal), true);
    assert.equal(pageEscapeAllowed(el("button", {}, main), noModal), true);
});

// The same decision ChapterLayout's Escape listener makes, applied to the Focus Mode state.
const escape = (focusMode: boolean, target: Node | null, doc: typeof noModal, defaultPrevented = false) =>
    !defaultPrevented && pageEscapeAllowed(target, doc) ? false : focusMode;

test("Focus Mode active, no modal: Escape exits, from the Focus Mode button or from page content", () => {
    const focusButton = el("button", { "aria-pressed": "true" }, el("div", {}, body));
    assert.equal(escape(true, focusButton, noModal), false);
    assert.equal(escape(true, main, noModal), false);
});

test("Focus Mode active, fullscreen lab open: first Escape closes only the lab, the second exits Focus Mode", () => {
    const opener = el("button", {}, main);
    const lab = el("div", { role: "dialog", "aria-modal": "true" }, body);
    const closeButton = el("button", {}, lab);
    // First Escape: the lab handled it (preventDefault) and owns it by target and by the open modal.
    let focusMode = escape(true, closeButton, modalOpen, true);
    assert.equal(focusMode, true, "first Escape belongs to the lab");
    assert.equal(escape(true, closeButton, modalOpen), true, "blocked even without preventDefault");
    // Lab closed, focus returned to its opener: the next Escape exits Focus Mode.
    focusMode = escape(focusMode, opener, noModal);
    assert.equal(focusMode, false, "second Escape exits Focus Mode");
});

test("ChapterLayout: no single-letter Focus Mode shortcut, both page shortcuts go through the guards", () => {
    const layout = source("ChapterLayout.tsx");
    assert.doesNotMatch(layout, /e\.key === ['"][fF]['"]/, "plain F no longer toggles Focus Mode");
    assert.doesNotMatch(layout, />F<\/kbd>/, "no F hint on the Focus Mode button");
    assert.match(layout, /if \(!pageEscapeAllowed\(target, document\)\) return;/);
    const nav = layout.slice(layout.indexOf("const handleKeyNav"), layout.indexOf("window.addEventListener('keydown', handleKeyNav)"));
    assert.ok(nav.indexOf("pageArrowsAllowed(target, document)") > -1, "arrow guard present");
    assert.ok(nav.indexOf("pageArrowsAllowed") < nav.indexOf("isRtl"), "guard runs before the RTL/LTR direction mapping");
});

test("fullscreen lab: role=dialog aria-modal, and its Escape is marked as handled", () => {
    const lab = source("ai-internals", "ExpandableLab.tsx");
    assert.match(lab, /role="dialog"\s+aria-modal="true"/);
    assert.match(lab, /if \(e\.key === 'Escape'\) \{[^}]*e\.preventDefault\(\);[^}]*setExpanded\(false\);/);
});
