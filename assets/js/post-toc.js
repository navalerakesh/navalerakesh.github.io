// Floating table of contents for blog posts
// Builds a right-side nav from h2/h3 headings inside .post-content

(function () {
  if (typeof document === "undefined") return;

  document.addEventListener("DOMContentLoaded", function () {
    var postContent = document.querySelector(".post-page .post-content");
    if (!postContent) return;

    var tocContainer = document.querySelector(".post-page .post-toc");
    if (!tocContainer) return;

    // Collect headings (h2/h3) as TOC entries
    var headings = postContent.querySelectorAll("h2, h3");
    if (!headings.length) {
      tocContainer.style.display = "none";
      return;
    }

    var tocList = document.createElement("ul");
    tocList.className = "post-toc-list";

    headings.forEach(function (heading) {
      if (!heading.id) {
        // Generate a slug from the text content
        var slug = heading.textContent
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
        if (!slug) return;

        // Ensure uniqueness
        var base = slug;
        var counter = 1;
        while (document.getElementById(slug)) {
          slug = base + "-" + counter++;
        }
        heading.id = slug;
      }

      var level = heading.tagName.toLowerCase();

      var li = document.createElement("li");
      li.className =
        "post-toc-item post-toc-item-" + (level === "h2" ? "level-2" : "level-3");

      var link = document.createElement("a");
      link.className = "post-toc-link";
      link.href = "#" + heading.id;
      link.textContent = heading.textContent.trim();

      link.addEventListener("click", function (e) {
        e.preventDefault();
        var target = document.getElementById(heading.id);
        if (!target) return;

        var offset = 80; // account for fixed nav / padding
        var rect = target.getBoundingClientRect();
        var scrollTop = window.pageYOffset + rect.top - offset;

        window.scrollTo({ top: scrollTop, behavior: "smooth" });
      });

      li.appendChild(link);
      tocList.appendChild(li);
    });

    if (!tocList.children.length) {
      tocContainer.style.display = "none";
      return;
    }

    var title = document.createElement("div");
    title.className = "post-toc-title";
    title.textContent = "On this page";

    tocContainer.appendChild(title);
    tocContainer.appendChild(tocList);
  });
})();
