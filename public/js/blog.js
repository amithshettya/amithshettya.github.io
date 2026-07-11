var allPosts = [];
var currentCategory = "all";

(function () {
  var path = window.location.pathname.replace(/\/+$/, "");
  var postMatch = path.match(/^\/blog\/([a-zA-Z_-]+)\/([a-zA-Z_-]+)$/);
  if (postMatch) {
    var categoryEl = document.querySelector(
      '.sidebar-category[data-category-slug="' + postMatch[1] + '"]'
    );
    if (categoryEl) {
      categoryEl.classList.add("expanded");
      var btn = categoryEl.querySelector(".category-toggle-btn");
      if (btn) btn.setAttribute("aria-expanded", "true");
      var catLink = categoryEl.querySelector(".category-name");
      if (catLink) {
        catLink.classList.add("sidebar-link-active");
      }
    }
  }
})();

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
      var featuredBadge = p.featured ? '<span class="badge badge-accent">Featured</span>' : "";
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
        featuredBadge +
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
  restoreSidebarForListing();
}

function expandBlogSection() {
  var section = document.querySelector(".blog-section");
  if (section && !section.classList.contains("expanded")) {
    section.classList.add("expanded");
    var btn = section.querySelector(".blog-toggle-btn");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }
}

function collapseBlogSection() {
  var section = document.querySelector(".blog-section");
  if (section) {
    section.classList.remove("expanded");
    var btn = section.querySelector(".blog-toggle-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }
}

function restoreSidebarForListing() {
  document.querySelectorAll(".sidebar-category").forEach(function (el) {
    el.classList.remove("expanded");
    var btn = el.querySelector(".category-toggle-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll(".sidebar-subposts").forEach(function (el) {
    el.innerHTML = "";
  });
  document.querySelectorAll(".sidebar-link, .category-name").forEach(function (el) {
    el.classList.remove("sidebar-link-active");
    el.removeAttribute("aria-current");
  });
  var blogLink = document.querySelector('.sidebar-link[href="/blog"]');
  if (blogLink) {
    blogLink.classList.add("sidebar-link-active");
    blogLink.setAttribute("aria-current", "page");
  }
}

function updateSidebarForPost(category, slug) {
  document.querySelectorAll(".sidebar-link, .category-name").forEach(function (el) {
    el.classList.remove("sidebar-link-active");
    el.removeAttribute("aria-current");
  });

  var categoryEl = document.querySelector(
    '.sidebar-category[data-category-slug="' + category + '"]'
  );
  if (!categoryEl) return;

  var catLink = categoryEl.querySelector(".category-name");
  if (catLink) {
    catLink.classList.add("sidebar-link-active");
  }

  var siblings = allPosts.filter(function (p) {
    return p.category === category;
  });

  var subpostsContainer = categoryEl.querySelector(".sidebar-subposts");
  if (subpostsContainer && siblings.length > 0) {
    categoryEl.classList.add("expanded");
    var catBtn = categoryEl.querySelector(".category-toggle-btn");
    if (catBtn) catBtn.setAttribute("aria-expanded", "true");
    subpostsContainer.innerHTML = siblings
      .map(function (p) {
        var isActive = p.slug === slug;
        var classes = "sidebar-subpost" + (isActive ? " sidebar-subpost-active" : "");
        var aria = isActive ? ' aria-current="page"' : "";
        return (
          '<a href="/blog/' +
          p.category +
          "/" +
          p.slug +
          '/" class="' +
          classes +
          '"' +
          aria +
          ">" +
          p.title +
          "</a>"
        );
      })
      .join("");
  }
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
  var path = window.location.pathname.replace(/\/+$/, "");
  var postMatch = path.match(/^\/blog\/([a-zA-Z_-]+)\/([a-zA-Z_-]+)$/);
  if (postMatch) {
    updateSidebarForPost(postMatch[1], postMatch[2]);
  } else {
    var catMatch = path.match(/^\/blog\/([a-zA-Z_-]+)$/);
    filterPosts(catMatch ? catMatch[1] : "all");
  }
});

document.addEventListener("htmx:afterSwap", function (e) {
  if (e.detail.target.id === "main-content") {
    var titleEl = e.detail.elt.querySelector("[data-page-title]");
    document.title = titleEl
      ? titleEl.dataset.pageTitle + " | Amith Shetty"
      : "Blog | Amith Shetty";
    htmx.process(e.detail.target);

    var path = window.location.pathname;
    var postMatch = path.match(/^\/blog\/([a-zA-Z_-]+)\/([a-zA-Z_-]+)$/);
    if (postMatch) {
      updateSidebarForPost(postMatch[1], postMatch[2]);
    }
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
    window.allPosts = posts;
    var path = window.location.pathname.replace(/\/+$/, "");
    var postMatch = path.match(/^\/blog\/([a-zA-Z_-]+)\/([a-zA-Z_-]+)$/);
    if (postMatch) {
      renderPosts([]);
      updateSidebarForPost(postMatch[1], postMatch[2]);
    } else {
      var catMatch = path.match(/^\/blog\/([a-zA-Z_-]+)$/);
      filterPosts(catMatch ? catMatch[1] : "all");
    }
  });
