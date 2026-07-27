document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-track]").forEach((link) => {
  link.addEventListener("click", () => {
    console.info("contact_action", link.dataset.track);
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll(".gallery-item");
const gallerySlider = document.querySelector(".gallery-grid");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
const galleryCounter = document.querySelector(".gallery-counter");

let activeGalleryFilter = "all";
let activeGalleryIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let ignoreNextGalleryClick = false;

const visibleGalleryItems = () =>
  Array.from(galleryItems).filter(
    (item) => activeGalleryFilter === "all" || item.dataset.category === activeGalleryFilter,
  );

const renderGallery = () => {
  const visibleItems = visibleGalleryItems();

  if (!visibleItems.length) {
    galleryItems.forEach((item) => {
      item.classList.add("hidden");
      item.classList.remove("active");
      item.tabIndex = -1;
      item.setAttribute("aria-hidden", "true");
    });
    if (galleryPrev) galleryPrev.disabled = true;
    if (galleryNext) galleryNext.disabled = true;
    if (galleryCounter) galleryCounter.textContent = "0 / 0";
    return;
  }

  if (activeGalleryIndex >= visibleItems.length) activeGalleryIndex = 0;
  if (activeGalleryIndex < 0) activeGalleryIndex = visibleItems.length - 1;

  galleryItems.forEach((item) => {
    const isVisible = visibleItems.includes(item);
    const isActive = item === visibleItems[activeGalleryIndex];

    item.classList.toggle("hidden", !isVisible);
    item.classList.toggle("active", isActive);
    item.tabIndex = isActive ? 0 : -1;
    item.setAttribute("aria-hidden", isActive ? "false" : "true");
  });

  const hasMultipleItems = visibleItems.length > 1;
  if (galleryPrev) galleryPrev.disabled = !hasMultipleItems;
  if (galleryNext) galleryNext.disabled = !hasMultipleItems;
  if (galleryCounter) galleryCounter.textContent = `${activeGalleryIndex + 1} / ${visibleItems.length}`;
};

const showGalleryItem = (direction) => {
  const visibleItems = visibleGalleryItems();
  if (visibleItems.length <= 1) return;

  activeGalleryIndex = (activeGalleryIndex + direction + visibleItems.length) % visibleItems.length;
  renderGallery();
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeGalleryFilter = button.dataset.filter;
    activeGalleryIndex = 0;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderGallery();
  });
});

galleryPrev?.addEventListener("click", () => showGalleryItem(-1));
galleryNext?.addEventListener("click", () => showGalleryItem(1));

gallerySlider?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

  event.preventDefault();
  showGalleryItem(event.key === "ArrowRight" ? 1 : -1);
});

gallerySlider?.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  },
  { passive: true },
);

gallerySlider?.addEventListener(
  "touchend",
  (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const isHorizontalSwipe = Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (!isHorizontalSwipe) return;

    ignoreNextGalleryClick = true;
    showGalleryItem(deltaX < 0 ? 1 : -1);
    window.setTimeout(() => {
      ignoreNextGalleryClick = false;
    }, 320);
  },
  { passive: true },
);

renderGallery();

const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("p");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

galleryItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (ignoreNextGalleryClick) {
      event.preventDefault();
      return;
    }

    if (!lightbox || !lightboxImage || !lightboxCaption) return;

    const image = item.querySelector("img");
    lightboxImage.src = item.dataset.full || image?.src || "";
    lightboxImage.alt = image?.alt || "";
    lightboxCaption.textContent = item.querySelector("span")?.textContent || "";
    document.body.classList.add("lightbox-open");
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener("click", () => lightbox?.close());
lightbox?.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  if (lightboxImage) lightboxImage.src = "";
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

const quoteForm = document.getElementById("quote-form");

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const message = [
      "Hi Aron Elite Projects, I would like to get a free quote.",
      "",
      `Name: ${formData.get("name") || ""}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Service: ${formData.get("service") || ""}`,
      `Location: ${formData.get("location") || ""}`,
      `Project details: ${formData.get("details") || ""}`,
    ].join("\n");

    const url = `https://wa.me/972508658498?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });
}
