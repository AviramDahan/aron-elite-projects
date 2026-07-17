document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-track]").forEach((link) => {
  link.addEventListener("click", () => {
    console.info("contact_action", link.dataset.track);
  });
});
