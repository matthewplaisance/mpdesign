jQuery(function ($) {
  "use strict";

  let $workContainer = null;
  let currentSearch = "";

  // Isotope filter callback: keep a card when its id/title/category contains
  // the active search term. Returns true for everything when search is empty.
  function searchFilter() {
    if (!currentSearch) return true;
    const $item = $(this);
    const text = (
      ($item.attr("data-project-id") || "") + " " +
      $item.find(".post-02__title").text() + " " +
      $item.find(".post-02__department").text()
    ).toLowerCase();
    return text.indexOf(currentSearch) !== -1;
  }

  function initWorkGrid() {
    $(".grid-css").each(function () {
      const $workWrapper = $(this);
      const $filters = $(".filter", $workWrapper);
      const duration = 0.3;

      $workContainer = $(".grid__inner", $workWrapper);

      $workContainer.isotope({
        layoutMode: "masonry",
        itemSelector: ".grid-item",
        transitionDuration: duration + "s",
        masonry: {
          columnWidth: ".grid-sizer",
        },
      });

      $workContainer.imagesLoaded().progress(function () {
        $workContainer.isotope("layout");
      });

      $filters.on("click", "a", function (e) {
        e.preventDefault();
        const $el = $(this);
        const selector = $el.attr("data-filter");
        $filters.find(".current").removeClass("current");
        $el.parent().addClass("current");
        $workContainer.isotope({ filter: selector });
      });
    });
  }

  function getProjectId(project) {
    return (
      project.postId ||
      project.id ||
      project.slug ||
      project.projectId ||
      project.folder ||
      project.name ||
      ""
    );
  }

  function injectProjectCard(project) {
    const projectId = getProjectId(project);
    if (!projectId) {
      console.warn("Project missing id:", project);
      return;
    }

    const title = project.title || projectId;
    const description = project.description || "";
    const className = project.className || "";

    const href = `project-detail.html?project=${encodeURIComponent(projectId)}`;
    const imgCandidates = [
      `assets/img/projects/${projectId}/index.JPG`,
      `assets/img/projects/${projectId}/index.jpg`,
      `assets/img/projects/${projectId}/index.png`,
    ];
    const imgSrc = imgCandidates[0];

    const $newItem = $(`
      <div class="grid-item ${className}" data-project-id="${projectId}">
        <a href="${href}" class="project-link">
          <div class="grid-item__inner">
            <div class="grid-item__content-wrapper">
              <div class="post-02">
                <div class="post-02__media">
                  <img src="${imgSrc}" alt="">
                </div>
                <div class="post-02__body">
                  <h2 class="post-02__title">${title}</h2>
                  <div class="post-02__department">${description}</div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    `);

    if (!$workContainer || !$workContainer.length) {
      console.warn("Work container not found; cannot inject project cards.");
      return;
    }

    const imgEl = $newItem.find("img")[0];
    if (imgEl) {
      let candidateIndex = 1;
      imgEl.addEventListener("error", function onError() {
        if (candidateIndex >= imgCandidates.length) {
          imgEl.removeEventListener("error", onError);
          return;
        }
        imgEl.src = imgCandidates[candidateIndex++];
      });
    }

    $workContainer.append($newItem);

    $newItem.imagesLoaded(function () {
      $workContainer.isotope("appended", $newItem);
      // Re-apply an active search so cards appended after load stay filtered.
      if (currentSearch) $workContainer.isotope({ filter: searchFilter });
      $workContainer.isotope("layout");
    });
  }

  // Close the mobile slide-in menu. The menu plugin's "click outside to close"
  // is blocked by a stopPropagation on the menu, so tapping a nav link leaves
  // the drawer open — close it explicitly here.
  function closeMobileMenu() {
    $(".consult-nav .consult-menu").removeClass("active");
    $(".navbar-toggle").removeClass("open");
  }

  function scrollEvent(divId) {
    closeMobileMenu();
    const $div = $("#" + divId);
    if (!$div.length) return;
    // jQuery animate (instead of native smooth scroll) so the duration is
    // controllable — bump the number to slow the glide further.
    $("html, body").stop().animate({ scrollTop: $div.offset().top }, 1200, "swing");
  }

  document.getElementById("home-nav")?.addEventListener("click", () => scrollEvent("home-sect"));
  document.getElementById("abt-nav")?.addEventListener("click", () => scrollEvent("abt-sect"));
  document.getElementById("work-nav")?.addEventListener("click", () => scrollEvent("work-sect"));
  document.getElementById("refs-nav")?.addEventListener("click", () => scrollEvent("refs-sect"));
  document.getElementById("contact-nav")?.addEventListener("click", () => scrollEvent("contact-sect"));

  $(document).on("click", "a.project-link", function () {
    const href = $(this).attr("href") || "";
    const url = new URL(href, window.location.href);
    const projectId =
      url.searchParams.get("project") ||
      $(this).closest("[data-project-id]").attr("data-project-id") ||
      "";

    if (projectId) {
      sessionStorage.setItem("projectName", projectId);
    }
  });

  initWorkGrid();

  fetch("data/projects.json")
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load data/projects.json (${r.status})`);
      return r.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        console.warn("projects.json is not an array:", data);
        return;
      }

      // Pick up a ?search= term (set by the header search box) before injecting
      // cards so it applies as they load.
      const searchParam = new URLSearchParams(window.location.search).get("search");
      if (searchParam) {
        currentSearch = searchParam.trim().toLowerCase();
        $(".search-form input").val(searchParam);
      }

      data.forEach(injectProjectCard);

      if (currentSearch) {
        $workContainer.isotope({ filter: searchFilter });
        document.getElementById("work-sect")?.scrollIntoView({ behavior: "smooth" });
      }
    })
    .catch((err) => console.error("Error loading JSON:", err));
});
