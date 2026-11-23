/* V105: presentation-only fallback for vector letters followed by U+20D7.
 * Original HTML/text formula, mathematical order, marks and teacher solutions
 * remain intact. One hidden-at-zero-size source combining mark remains in the
 * textContent for each vector symbol; the visible arrow is drawn in CSS.
 *
 * Only pages intentionally importing this module are processed. No external
 * packages, network access, Firebase writes, reporting or student tracking.
 */
(() => {
  "use strict";
  const mark = "\u20D7";
  const regex = /(\p{L})\u20D7/gu;
  const restricted = "script,style,noscript,textarea,code,pre,svg,math,option,input,[contenteditable],.psn-vector-symbol";
  const greekNames = { "τ": "tau", "ω": "omega", "α": "alpha", "β": "beta", "θ": "theta", "Σ": "sigma" };
  let processed = 0;
  function eligible(node) {
    const parent = node.parentElement;
    return Boolean(parent && !parent.closest(restricted));
  }
  function decorate(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.data.includes(mark) || !eligible(node)) return;
    const original = node.data;
    regex.lastIndex = 0;
    let match, at = 0;
    const fragment = document.createDocumentFragment();
    let changes = 0;
    while ((match = regex.exec(original)) !== null) {
      if (match.index > at) fragment.append(document.createTextNode(original.slice(at, match.index)));
      const letter = match[1];
      const wrapper = document.createElement("span");
      wrapper.className = "psn-vector-symbol";
      wrapper.setAttribute("role", "img");
      wrapper.setAttribute("aria-label", "vector " + (greekNames[letter] || letter));
      const base = document.createElement("span");
      base.setAttribute("aria-hidden", "true");
      base.textContent = letter;
      const sourceMark = document.createElement("span");
      sourceMark.className = "psn-vector-source-mark";
      sourceMark.setAttribute("aria-hidden", "true");
      sourceMark.textContent = mark;
      wrapper.append(base, sourceMark);
      fragment.append(wrapper);
      at = match.index + match[0].length;
      changes++;
    }
    if (!changes) return;
    if (at < original.length) fragment.append(document.createTextNode(original.slice(at)));
    node.replaceWith(fragment);
    processed += changes;
  }
  function apply(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) { decorate(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE || root.matches(restricted)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.data.includes(mark) && eligible(walker.currentNode)) nodes.push(walker.currentNode);
    }
    for (const node of nodes) decorate(node);
  }
  function init() {
    const root = document.querySelector("main");
    if (!root) return;
    apply(root);
    // The public descriptive finder renders source-labelled question links from
    // JSON after page load; decorate added content without changing the JSON.
    const observer = new MutationObserver(records => {
      for (const change of records) for (const node of change.addedNodes) apply(node);
    });
    observer.observe(root, {childList: true, subtree: true});
    window.PSNVectorNotationV105 = Object.freeze({
      get correctedSymbols() { return processed; }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once: true});
  else init();
})();
