var allPosts = [];
var currentCategory = "all";

function renderPosts(posts) {
  var container = document.getElementById("blog-posts");
  if (!container) return;
  if (posts.length === 0) {
    container.innerHTML =
      '<p class="text-ink-soft dark:text-dark-ink-soft italic">No posts found.</p>';
    return;
  }
  container.innerHTML = posts
    .map(function (p) {
      var hxAttrs =
        'hx-get="/blog/' +
        p.category +
        "/" +
        p.slug +
        '.html" hx-target="#main-content" hx-swap="innerHTML" hx-push-url="/blog/' +
        p.category +
        "/" +
        p.slug +
        '"';
      return (
        '<article class="card p-6 group">' +
        '<div class="flex items-center gap-3 mb-3">' +
        '<span class="eyebrow-hand-sm">' +
        p.category +
        "</span>" +
        '<span class="text-grid-strong dark:text-dark-grid-strong">&bull;</span>' +
        '<time class="font-mono text-sm text-ink-soft dark:text-dark-ink-soft">' +
        p.date +
        "</time>" +
        "</div>" +
        '<h3 class="font-serif text-xl text-ink dark:text-dark-ink group-hover:text-accent dark:group-hover:text-dark-accent transition-colors">' +
        '<a href="/blog/' +
        p.category +
        "/" +
        p.slug +
        '/" ' +
        hxAttrs +
        ">" +
        p.title +
        "</a>" +
        "</h3>" +
        '<p class="text-ink-soft dark:text-dark-ink-soft mt-2">' +
        p.description +
        "</p>" +
        "</article>"
      );
    })
    .join("\n");
}

function setActivePill(category) {
  document.querySelectorAll(".pill").forEach(function (pill) {
    pill.classList.toggle("pill-active", pill.dataset.category === category);
  });
}

function filterPosts(category) {
  currentCategory = category;
  var filtered =
    category === "all"
      ? allPosts
      : allPosts.filter(function (p) {
          return p.category === category;
        });
  renderPosts(filtered);
  setActivePill(category);
}

document.querySelectorAll(".pill").forEach(function (pill) {
  pill.addEventListener("click", function (e) {
    e.preventDefault();
    var category = this.dataset.category;
    filterPosts(category);
    var url = category === "all" ? "/blog" : "/blog/" + category;
    history.pushState({}, "", url);
  });
});

window.addEventListener("popstate", function () {
  var path = window.location.pathname;
  var match = path.match(/^\/blog\/([a-zA-Z_-]+)$/);
  filterPosts(match ? match[1] : "all");
});

document.addEventListener("htmx:afterSwap", function (e) {
  if (e.detail.target.id === "main-content") {
    var titleEl = e.detail.elt.querySelector("[data-page-title]");
    document.title = titleEl
      ? titleEl.dataset.pageTitle + " | Amith Shetty"
      : "Blog | Amith Shetty";
    htmx.process(e.detail.target);
  }
});

fetch("/blog/index.json")
  .then(function (r) {
    return r.json();
  })
  .then(function (data) {
    var posts = data.posts;
    var categories = data.categories;

    var filtersContainer = document.querySelector(".category-filters");
    if (filtersContainer && categories.length) {
      var pillsHtml =
        '<a href="/blog" class="pill pill-active" data-category="all">All</a>';
      categories.forEach(function (cat) {
        pillsHtml +=
          '<a href="/blog/' +
          cat.slug +
          '" class="pill" data-category="' +
          cat.slug +
          '">' +
          cat.name +
          "</a>";
      });
      filtersContainer.innerHTML = pillsHtml;

      filtersContainer.querySelectorAll(".pill").forEach(function (pill) {
        pill.addEventListener("click", function (e) {
          e.preventDefault();
          var category = this.dataset.category;
          filterPosts(category);
          var url = category === "all" ? "/blog" : "/blog/" + category;
          history.pushState({}, "", url);
        });
      });
    }

    allPosts = posts;
    var path = window.location.pathname;
    var match = path.match(/^\/blog\/([a-zA-Z_-]+)$/);
    filterPosts(match ? match[1] : "all");
  });
