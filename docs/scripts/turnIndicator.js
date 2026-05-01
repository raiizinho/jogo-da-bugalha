export async function mostrarVezJogador(nome) {
  document.querySelector(".turn-overlay")?.remove();

  const res = await fetch("./styles/html/turnIndicator.html");
  if (!res.ok) throw new Error("Erro ao carregar HTML");

  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const overlay = doc.body.firstElementChild;

  overlay.querySelector(".popup-text").textContent = `Vez de ${nome}.`;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add("show"));

  setTimeout(() => {
    overlay.classList.add("hide");
    setTimeout(() => overlay.remove(), 180);
  }, 620);
}
