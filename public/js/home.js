fetch("/blog/index.json")
  .then(function (r) { return r.json(); })
  .then(function (data) {
    var featured = data.posts.filter(function (p) { return p.featured; });
    var container = document.getElementById("featured-posts");
    if (!container || featured.length === 0) return;

    container.innerHTML = featured.map(function (p) {
      return (
        '<article class="card-featured group">' +
        '<div class="flex items-center gap-3 mb-3">' +
        '<span class="eyebrow-hand-sm">' +
        p.category +
        "</span>" +
        '<span class="text-grid-strong dark:text-dark-grid-strong">&bull;</span>' +
        '<time class="font-mono text-sm text-ink-soft dark:text-dark-ink-soft">' +
        p.date +
        "</time>" +
        '<span class="badge badge-accent">Featured</span>' +
        "</div>" +
        '<h3 class="font-serif text-xl text-ink dark:text-dark-ink group-hover:text-accent dark:group-hover:text-dark-accent transition-colors">' +
        '<a href="/blog/' +
        p.category +
        "/" +
        p.slug +
        '/">' +
        p.title +
        "</a>" +
        "</h3>" +
        '<p class="text-ink-soft dark:text-dark-ink-soft mt-2 text-lg">' +
        p.description +
        "</p>" +
        "</article>"
      );
    }).join("");
  });
