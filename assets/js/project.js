jQuery(function ($) {
  "use strict";

  function pickFirstExisting(urls) {
    return new Promise((resolve) => {
      let i = 0;

      function tryNext() {
        if (i >= urls.length) return resolve(null);
        const url = urls[i++];
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => tryNext();
        img.src = url;
      }

      tryNext();
    });
  }

  function setImgWithFallback(imgEl, urls) {
    let i = 0;

    function tryNext() {
      if (i >= urls.length) return;
      imgEl.src = urls[i++];
    }

    imgEl.onerror = tryNext;
    tryNext();
  }

  const urlParams = new URLSearchParams(window.location.search);
  const fromQuery = urlParams.get("project");
  const fromSession = sessionStorage.getItem("projectName") || sessionStorage.getItem("projectDetail");
  const projectId = (fromQuery || fromSession || "").trim();

  if (projectId) {
    sessionStorage.setItem("projectName", projectId);
  }

  const $title = $("#project-title");

  // Fill an infobox value, or hide its column entirely when there is no data
  // (avoids showing stale placeholder text for fields the project doesn't have).
  function fillInfobox(id, value) {
    const $desc = $("#" + id);
    if (!$desc.length) return;
    const $col = $desc.closest('[class*="col-"]');
    if (value) {
      $desc.text(value);
      $col.show();
    } else {
      $col.hide();
    }
  }

  fetch("data/projects.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (!projectId || !Array.isArray(data)) return;
      const match = data.find((p) => {
        const id = p.postId || p.id || p.slug || p.projectId || p.folder || p.name;
        return String(id || "") === projectId;
      });
      if (!match) return;

      if ($title.length) $title.text(match.title || projectId);
      document.title = (match.title || projectId) + " | Plaisance Design";

      const client = match.client || match.customer || match.owner;
      const date = match.date || match.dates || match.when;
      const type = match.type || match.projectType || match.category || match.description;

      fillInfobox("project-client", client);
      fillInfobox("project-date", date);
      fillInfobox("project-type", type);
    })
    .catch(() => {});

  const carouselCandidates1 = [
    `assets/img/projects/${projectId}/mainafter.JPG`,
    `assets/img/projects/${projectId}/mainafter.jpg`,
    `assets/img/projects/${projectId}/mainafter.png`,
    `assets/img/projects/${projectId}/index.JPG`,
    `assets/img/projects/${projectId}/index.jpg`,
  ];

  const carouselCandidates2 = [
    `assets/img/projects/${projectId}/mainbefore.JPG`,
    `assets/img/projects/${projectId}/mainbefore.jpg`,
    `assets/img/projects/${projectId}/mainbefore.png`,
    `assets/img/projects/${projectId}/index2.JPG`,
    `assets/img/projects/${projectId}/index2.jpg`,
  ];

  const img1Candidates = [
    `assets/img/projects/${projectId}/index.JPG`,
    `assets/img/projects/${projectId}/index.jpg`,
    `assets/img/projects/${projectId}/index.png`,
  ];

  const img2Candidates = [
    `assets/img/projects/${projectId}/index2.JPG`,
    `assets/img/projects/${projectId}/index2.jpg`,
    `assets/img/projects/${projectId}/index2.png`,
    `assets/img/projects/${projectId}/index.JPG`,
    `assets/img/projects/${projectId}/index.jpg`,
  ];

  const img1 = document.getElementById("img1");
  const img2 = document.getElementById("img2");

  if (projectId && img1) setImgWithFallback(img1, img1Candidates);
  if (projectId && img2) setImgWithFallback(img2, img2Candidates);

  const $carousel = $(".carousel__element");
  if (!$carousel.length || !$.fn.owlCarousel || !projectId) return;

  async function paintSlides() {
    const url1 = await pickFirstExisting(carouselCandidates1);
    const url2 = await pickFirstExisting(carouselCandidates2);

    const $slides = $carousel.find(".owl-item:not(.cloned) .slider__item");
    if ($slides.length < 2) return;

    if (url1) $slides.eq(0).css("background-image", `url('${url1}')`);
    if (url2) $slides.eq(1).css("background-image", `url('${url2}')`);
  }

  $carousel.on("initialized.owl.carousel", paintSlides);

  if ($carousel.hasClass("owl-loaded")) {
    paintSlides();
  }
});
