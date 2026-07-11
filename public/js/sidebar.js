function toggleSidebar() {
  document.querySelector(".sidebar-nav").classList.toggle("open");
  document.querySelector(".sidebar-overlay").classList.toggle("open");
}

function toggleBlogSection() {
  var section = document.querySelector(".blog-section");
  if (!section) return;
  section.classList.toggle("expanded");
  var btn = section.querySelector(".blog-toggle-btn");
  if (btn) {
    btn.setAttribute("aria-expanded", section.classList.contains("expanded"));
  }
}

function ensureAllPosts() {
  if (window.allPosts && window.allPosts.length > 0) {
    return Promise.resolve(window.allPosts);
  }
  return fetch("/blog/index.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      window.allPosts = data.posts || [];
      return window.allPosts;
    });
}

function toggleCategory(slug) {
  var categoryEl = document.querySelector(
    '.sidebar-category[data-category-slug="' + slug + '"]'
  );
  if (!categoryEl) return;
  categoryEl.classList.toggle("expanded");
  var btn = categoryEl.querySelector(".category-toggle-btn");
  if (btn) {
    btn.setAttribute("aria-expanded", categoryEl.classList.contains("expanded"));
  }

  var subpostsContainer = categoryEl.querySelector(".sidebar-subposts");
  if (subpostsContainer && subpostsContainer.innerHTML === "") {
    ensureAllPosts().then(function (posts) {
      var siblings = posts.filter(function (p) {
        return p.category === slug;
      });
      if (siblings.length > 0) {
        subpostsContainer.innerHTML = siblings
          .map(function (p) {
            return '<a href="/blog/' + p.category + "/" + p.slug + '/" class="sidebar-subpost">' + p.title + "</a>";
          })
          .join("");
      }
    });
  }
}
