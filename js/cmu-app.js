/* Carnegie Mellon Web Kit: behaviors for the kit's components. Load it after
   the template's scripts, at the end of <body>. Each behavior hooks onto a
   data-cmu-* attribute and works on markup added later too. */
(function () {
  "use strict";

  // Copy button: <button class="btn" type="button" data-cmu-copy="#id">.
  // Copies the target's text, says "Copied" on the button for two seconds
  // and tells screen readers. Without the clipboard (an http page, an old
  // browser) it selects the text and asks for the keyboard instead. The icon
  // version (button.cmu-copy, named by aria-label and title) shows a check
  // and puts the message in its label and tooltip instead.
  var status;
  function announce(text) {
    if (!status) {
      status = document.createElement("p");
      status.className = "sr-only";
      status.setAttribute("aria-live", "polite");
      document.body.appendChild(status);
    }
    status.textContent = "";
    setTimeout(function () {
      status.textContent = text;
    }, 50);
  }
  function selectText(el) {
    if (el.select) return el.select();
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  function flash(button, label, state) {
    var icon = button.classList.contains("cmu-copy");
    if (!button.hasAttribute("data-cmu-copy-label"))
      button.setAttribute(
        "data-cmu-copy-label",
        icon ? button.getAttribute("aria-label") || "" : button.textContent,
      );
    var original = button.getAttribute("data-cmu-copy-label");
    if (icon) {
      button.setAttribute("data-cmu-copy-state", state);
      button.setAttribute("aria-label", label);
      button.title = label;
    } else {
      button.textContent = label;
    }
    clearTimeout(button.cmuCopyTimer);
    button.cmuCopyTimer = setTimeout(function () {
      if (icon) {
        button.removeAttribute("data-cmu-copy-state");
        button.setAttribute("aria-label", original);
        button.title = original;
      } else {
        button.textContent = original;
      }
    }, 2000);
  }
  document.addEventListener("click", function (e) {
    var button = e.target.closest && e.target.closest("[data-cmu-copy]");
    if (!button) return;
    var target = document.querySelector(button.getAttribute("data-cmu-copy"));
    if (!target) return;
    var text = "value" in target ? target.value : target.textContent;
    var fallback = function () {
      selectText(target);
      var keys = /Mac|iPhone|iPad/.test(navigator.platform) ? "Command-C" : "Control-C";
      flash(button, "Press " + keys, "keys");
      announce("Selected. Press " + keys + " to copy.");
    };
    if (!navigator.clipboard || !window.isSecureContext) return fallback();
    navigator.clipboard.writeText(text).then(function () {
      flash(button, "Copied", "copied");
      announce("Copied.");
    }, fallback);
  });
})();
