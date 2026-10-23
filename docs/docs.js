// Docs only: show each live example's markup under it, so every example is
// written once. Elements marked data-demo-skip are left out of the code.
document.querySelectorAll(".kit-demo").forEach(function (demo) {
  var copy = demo.cloneNode(true);
  copy.querySelectorAll("[data-demo-skip]").forEach(function (el) { el.remove(); });
  var lines = copy.innerHTML.replace(/^\s*\n|\s+$/g, "").split("\n");
  var indent = Math.min.apply(null, lines.filter(function (l) { return l.trim(); }).map(function (l) { return l.match(/^ */)[0].length; }));
  var pre = document.createElement("pre");
  pre.className = "kit-code";
  var code = document.createElement("code");
  code.textContent = lines.map(function (l) { return l.slice(indent); }).join("\n").replace(/=""/g, "").replace(/ data-preview/g, "");
  pre.appendChild(code);
  demo.after(pre);
});

// A dialog marked data-preview shows in place as a picture of itself, and
// its Open button shows the real modal (the <dialog> element does the rest)
function preview(d) { d.classList.add("kit-inline"); d.show(); }
document.querySelectorAll("dialog[data-preview]").forEach(function (d) {
  preview(d);
  d.addEventListener("close", function () { preview(d); });
});
document.querySelectorAll("[data-open-dialog]").forEach(function (b) {
  b.addEventListener("click", function () {
    var d = document.getElementById(b.dataset.openDialog);
    d.close(); d.classList.remove("kit-inline"); d.showModal();
  });
});
document.querySelectorAll("dialog [data-close]").forEach(function (b) {
  b.addEventListener("click", function () { b.closest("dialog").close(); });
});
