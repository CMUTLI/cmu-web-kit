// Docs only: show each live example's markup under it, so every example is
// written once. Elements marked data-demo-skip are left out of the code.
var COLORS = ["grey", "darkgrey", "red", "gold", "blue", "teal", "green", "darkgreen", "invert"];
document.querySelectorAll(".kit-demo").forEach(function (demo) {
  var copy = demo.cloneNode(true);
  copy.querySelectorAll("[data-demo-skip]").forEach(function (el) {
    el.remove();
  });
  var lines = copy.innerHTML.replace(/^\s*\n|\s+$/g, "").split("\n");
  var indent = Math.min.apply(
    null,
    lines
      .filter(function (l) {
        return l.trim();
      })
      .map(function (l) {
        return l.match(/^ */)[0].length;
      }),
  );
  var pre = document.createElement("pre");
  pre.className = "kit-code";
  var code = document.createElement("code");
  code.textContent = lines
    .map(function (l) {
      return l.slice(indent);
    })
    .join("\n")
    .replace(/=""/g, "")
    .replace(/ data-preview/g, "")
    .replace(/ data-kit-[\w-]+="[^"]*"/g, "");
  pre.appendChild(code);
  // A wide example is a real page section, edge to edge; its code goes in a
  // content block of its own, at the page's normal width
  if (demo.classList.contains("kit-demo--wide")) {
    var wrap = document.createElement("div");
    wrap.className = "content wide";
    // On the example's color too (not its plaid or globe), so the code reads
    // as part of the same section
    var section = demo.querySelector(".content, .grid");
    if (section)
      COLORS.forEach(function (c) {
        if (section.classList.contains(c)) wrap.classList.add(c);
      });
    wrap.appendChild(document.createElement("div")).appendChild(pre);
    demo.after(wrap);
  } else {
    demo.after(pre);
  }
});

// Forms in the examples don't go anywhere
document.querySelectorAll('.kit-demo form:not([method="dialog"])').forEach(function (f) {
  f.addEventListener("submit", function (e) {
    e.preventDefault();
  });
});

// A dialog marked data-preview shows in place as a picture of itself, and
// its Open button shows the real modal (the <dialog> element does the rest)
function preview(d) {
  d.classList.add("kit-inline");
  d.show();
}
document.querySelectorAll("dialog[data-preview]").forEach(function (d) {
  preview(d);
  // close() fires its event later, so skip it if the modal is already open
  d.addEventListener("close", function () {
    if (!d.open) preview(d);
  });
});
document.querySelectorAll("[data-open-dialog]").forEach(function (b) {
  b.addEventListener("click", function () {
    var d = document.getElementById(b.dataset.openDialog);
    d.close();
    d.classList.remove("kit-inline");
    d.showModal();
  });
});
document.querySelectorAll("dialog [data-close]").forEach(function (b) {
  b.addEventListener("click", function () {
    b.closest("dialog").close();
  });
});

// A demo filter: an input with data-kit-filter="list id" hides the list's
// items that don't match (text or data-keywords) and updates the count
document.querySelectorAll("[data-kit-filter]").forEach(function (input) {
  var list = document.getElementById(input.dataset.kitFilter);
  var count = document.getElementById(input.dataset.kitCount);
  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase(),
      shown = 0,
      items = list.children;
    Array.prototype.forEach.call(items, function (li) {
      var hit =
        !q || (li.textContent + " " + (li.dataset.keywords || "")).toLowerCase().indexOf(q) >= 0;
      li.hidden = !hit;
      if (hit) shown++;
    });
    count.textContent = !shown
      ? "Sorry, no results to display."
      : shown === items.length
        ? "Showing all " + shown + " people"
        : shown === 1
          ? "Showing 1 of " + items.length + " people"
          : "Showing " + shown + " of " + items.length + " people";
  });
});

// Try the header (Page Layout): the roof's color, the search box, signed in
// or out, and acting as another user, on the real header of every docs
// page. Choices last while you browse the docs, until Reset.
(function () {
  var roof = document.querySelector(".roof");
  if (!roof || document.body.dataset.kitNoTry !== undefined) return;
  var state = { roof: "red", search: "off", account: "none", acting: "off", logo: "off" };
  try {
    Object.assign(state, JSON.parse(sessionStorage.getItem("kit-header") || "{}"));
  } catch {
    /* storage can be blocked; keep going */
  }
  var actingBar =
    '<form class="cmu-acting-bar kit-try-added"><p>You\u2019re acting as Jane Doe (jdoe)</p>' +
    '<button type="submit" class="btn ghost small">Stop Acting as Jane Doe</button></form>';
  var searchForm =
    '<form action="https://search.cmu.edu" class="search search-form kit-try-added" method="get">' +
    '<label><span>Search</span> <input aria-label="Search" name="q" placeholder="Search"></label>' +
    '<button title="Submit" type="submit">Search</button></form>';
  function html(h) {
    var t = document.createElement("template");
    t.innerHTML = h;
    return t.content.firstChild;
  }
  function menuLists() {
    return document.querySelectorAll("#nav > ul, nav.tree > div > ul, nav.tree > ul");
  }
  // A logo needs the name and its h2 wrapped in a div, with the linked image
  // right after it and no space between (see Site Name)
  var sitename = document.getElementById("sitename");
  function setLogo(on) {
    var wrap = sitename.querySelector(":scope > .kit-try-name");
    if (on && !wrap) {
      wrap = document.createElement("div");
      wrap.className = "kit-try-name";
      while (sitename.firstChild) wrap.appendChild(sitename.firstChild);
      sitename.appendChild(wrap);
      sitename.appendChild(
        html(
          // A placeholder from PlaceMellon: the round Scotty profile picture
          '<a class="kit-try-logo" href="https://cmutli.github.io/cmu-placemellon/"><img src="https://placemellon.andrew.cmu.edu/150?profile" width="150" height="150" alt="Logo placeholder"></a>',
        ),
      );
    } else if (!on && wrap) {
      sitename.querySelector(".kit-try-logo").remove();
      while (wrap.firstChild) sitename.insertBefore(wrap.firstChild, wrap);
      wrap.remove();
    }
  }
  function apply() {
    document.querySelectorAll(".kit-try-added").forEach(function (el) {
      el.remove();
    });
    if (sitename) setLogo(state.logo === "on");
    roof.classList.toggle("red", state.roof === "red");
    roof.classList.toggle("darkgrey", state.roof === "gray");
    roof.classList.toggle("invert", state.roof !== "white");
    var row = roof.querySelector(":scope > div");
    if (state.search === "on") {
      row.querySelector(".menu-btn").after(html(searchForm));
      var tree = document.querySelector("nav.tree");
      if (tree) tree.querySelector(".menu-btn").after(html(searchForm));
    }
    if (state.account !== "none") {
      var inn = state.account !== "out",
        pic =
          state.account === "photo"
            ? '<img class="cmu-avatar" src="images/scotty.png" alt="">'
            : "";
      var a = html(
        inn
          ? '<a class="cmu-account cmu-account-open kit-try-added" href="#nav">' +
              pic +
              "Jane Doe</a>"
          : '<a class="cmu-account kit-try-added" href="layout.html#try-header">Sign In</a>',
      );
      if (inn)
        a.addEventListener("click", function (e) {
          e.preventDefault();
          roof.querySelector(".menu-btn").click();
        });
      row.appendChild(a);
      menuLists().forEach(function (ul) {
        ul.prepend(
          html(
            inn
              ? '<li class="secondary right cmu-account-menu kit-try-added"><a class="cmu-account-name">' +
                  pic +
                  'Jane Doe</a><a href="app-users.html#preferences">Preferences</a><a href="layout.html#try-header">Sign Out</a></li>'
              : '<li class="secondary right cmu-account-menu kit-try-added"><a href="layout.html#try-header">Sign In</a></li>',
          ),
        );
      });
    }
    var acting = state.acting === "on";
    document.body.classList.toggle("cmu-acting-as", acting);
    if (acting) {
      var bar = html(actingBar);
      bar.addEventListener("submit", function (e) {
        e.preventDefault();
        set("acting", "off");
      });
      document.body.appendChild(bar);
    }
    document.querySelectorAll("[data-kit-set]").forEach(function (b) {
      var kv = b.dataset.kitSet.split(":"),
        on = state[kv[0]] === kv[1];
      b.setAttribute("aria-pressed", on);
      b.className = on ? "btn small" : "btn small ghost";
    });
    document.querySelectorAll("[data-kit-acting]").forEach(function (b) {
      b.textContent = acting ? "Hide the Frame" : "Show the Frame on This Page";
    });
  }
  function set(k, v) {
    state[k] = v;
    try {
      sessionStorage.setItem("kit-header", JSON.stringify(state));
    } catch {
      /* storage can be blocked; keep going */
    }
    apply();
  }
  document.querySelectorAll("[data-kit-set]").forEach(function (b) {
    b.addEventListener("click", function () {
      var kv = b.dataset.kitSet.split(":");
      set(kv[0], kv[1]);
    });
  });
  document.querySelectorAll("[data-kit-acting]").forEach(function (b) {
    b.addEventListener("click", function () {
      set("acting", state.acting === "on" ? "off" : "on");
    });
  });
  document.querySelectorAll("[data-kit-reset]").forEach(function (b) {
    b.addEventListener("click", function () {
      state = { roof: "red", search: "off", account: "none", acting: "off", logo: "off" };
      try {
        sessionStorage.removeItem("kit-header");
      } catch {
        /* storage can be blocked; keep going */
      }
      apply();
    });
  });
  // Now, so the template's script copies the search and menu item into its
  // menu as it builds it; and again once it has, for anything it rebuilt
  apply();
  window.addEventListener("load", apply);
})();

// The Components table: sort by a column (click again to reverse) and
// filter as you type. Hidden rows go to the end, so the stripes stay even.
document.querySelectorAll("table[data-kit-sortable]").forEach(function (table) {
  var body = table.tBodies[0],
    rows = Array.prototype.slice.call(body.rows);
  var input = document.querySelector('[data-kit-filter-table="' + table.id + '"]');
  var count = input && document.getElementById(input.dataset.kitCount);
  var noun = input ? input.dataset.kitNoun : "row";
  var key = 0,
    dir = 1;
  function cell(r, i) {
    return r.cells[i].textContent.trim().toLowerCase();
  }
  function render() {
    var q = input ? input.value.trim().toLowerCase() : "",
      shown = [],
      hidden = [];
    rows
      .slice()
      .sort(function (a, b) {
        return dir * (cell(a, key) < cell(b, key) ? -1 : cell(a, key) > cell(b, key) ? 1 : 0);
      })
      .forEach(function (r) {
        (!q || r.textContent.toLowerCase().indexOf(q) >= 0 ? shown : hidden).push(r);
      });
    shown.forEach(function (r) {
      r.hidden = false;
      body.appendChild(r);
    });
    hidden.forEach(function (r) {
      r.hidden = true;
      body.appendChild(r);
    });
    if (count)
      count.textContent = !shown.length
        ? "Sorry, no results to display."
        : shown.length === rows.length
          ? "Showing all " + rows.length + " " + noun + "s"
          : "Showing " + shown.length + " of " + rows.length + " " + noun + "s";
  }
  table.querySelectorAll("th[data-sort-key] .cmu-sort").forEach(function (b) {
    b.addEventListener("click", function () {
      var th = b.closest("th"),
        i = th.cellIndex;
      dir = i === key ? -dir : 1;
      key = i;
      table.querySelectorAll("th[data-sort-key]").forEach(function (h) {
        h.removeAttribute("aria-sort");
        h.querySelector(".cmu-sort-arrow").textContent = "";
      });
      th.setAttribute("aria-sort", dir === 1 ? "ascending" : "descending");
      th.querySelector(".cmu-sort-arrow").textContent = dir === 1 ? " ▲" : " ▼";
      render();
    });
  });
  if (input) input.addEventListener("input", render);
  render();
});
