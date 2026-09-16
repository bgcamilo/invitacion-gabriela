// 1. Después de publicar Code.gs como aplicación web, pega aquí la URL que termina en /exec.
// 2. Mientras esté vacío, el formulario se valida pero no envía datos.
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbxGozuQQ_5y7TMbDsxTj1enXg6yJ72DpoVLk2JsnbuXY2MFXkxd_mQ99HuCOs35lhxv/exec";

const EVENT_DATE = new Date("2026-10-03T21:00:00-05:00");
const PHOTO_URLS = [
  "assets/IMG_5996.jpg",
  "assets/IMG_6000.jpg",
  "assets/IMG_6022.jpg",
  "assets/IMG_6026.jpg",
  "assets/IMG_6036.jpg"
];

function updateCountdown() {
  const remaining = Math.max(0, EVENT_DATE.getTime() - Date.now());
  const units = { days: 86400000, hours: 3600000, minutes: 60000, seconds: 1000 };
  let value = remaining;
  Object.entries(units).forEach(([id, size]) => {
    const amount = Math.floor(value / size);
    value %= size;
    document.getElementById(id).textContent = String(amount).padStart(id === "days" ? 3 : 2, "0");
  });
}

function renderGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = PHOTO_URLS.map((url, index) => url
    ? `<figure class="photo-slot"><img src="${url}" alt="Gabriela Ariza, fotografía ${index + 1}"></figure>`
    : `<div class="photo-slot"><span>Foto de Gabriela</span></div>`
  ).join("");
  gallery.querySelectorAll("img").forEach(image => image.addEventListener("error", () => {
    image.parentElement.innerHTML = "<span>Foto de Gabriela</span>";
  }, { once: true }));
}

const form = document.getElementById("rsvp-form");
const status = document.getElementById("form-status");

function attendanceValue() { return form.querySelector('input[name="asistencia"]:checked')?.value; }

form.addEventListener("submit", async event => {
  event.preventDefault();
  status.className = "form-status";
  if (!form.checkValidity()) { form.reportValidity(); return; }
  if (!RSVP_ENDPOINT) {
    status.textContent = "La confirmación está lista; falta conectar la hoja de respuestas. Consulta el archivo INSTRUCCIONES-RSVP.md.";
    status.classList.add("error");
    return;
  }
  const submitButton = form.querySelector("button");
  submitButton.disabled = true;
  submitButton.textContent = "Enviando…";
  try {
    const formData = new FormData(form);
    formData.set("total_personas", attendanceValue() === "Sí" ? "1" : "0");
    await fetch(RSVP_ENDPOINT, { method: "POST", mode: "no-cors", body: formData });
    form.reset();
    status.textContent = "¡Gracias! Tu respuesta fue registrada.";
  } catch {
    status.textContent = "No pudimos enviar tu respuesta. Intenta de nuevo más tarde.";
    status.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Enviar confirmación";
  }
});

updateCountdown(); setInterval(updateCountdown, 1000); renderGallery();
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
