document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-track]").forEach((link) => {
  link.addEventListener("click", () => {
    console.info("contact_action", link.dataset.track);
  });
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
