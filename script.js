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

const updateSliderControls = () => {
  if (!gallerySlider || !galleryPrev || !galleryNext) return;

  const maxScroll = gallerySlider.scrollWidth - gallerySlider.clientWidth;
  galleryPrev.disabled = gallerySlider.scrollLeft <= 4;
  galleryNext.disabled = gallerySlider.scrollLeft >= maxScroll - 4;
};

const scrollGallery = (direction) => {
  if (!gallerySlider) return;

  gallerySlider.scrollBy({
    left: direction * Math.round(gallerySlider.clientWidth * 0.82),
    behavior: "smooth",
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    galleryItems.forEach((item) => {
      const show = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hidden", !show);
    });

    if (gallerySlider) gallerySlider.scrollTo({ left: 0, behavior: "smooth" });
    requestAnimationFrame(updateSliderControls);
  });
});

galleryPrev?.addEventListener("click", () => scrollGallery(-1));
galleryNext?.addEventListener("click", () => scrollGallery(1));
gallerySlider?.addEventListener("scroll", updateSliderControls);
window.addEventListener("resize", updateSliderControls);
updateSliderControls();

const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("p");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
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
