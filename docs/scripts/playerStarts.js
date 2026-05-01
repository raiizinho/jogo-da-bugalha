export async function jogadorComeca(nome) {
  document.querySelector(".overlay")?.remove();

  const res = await fetch("./styles/html/playerStarts.html");
  if (!res.ok) throw new Error("Erro ao carregar HTML");

  const html = await res.text();

  const doc = new DOMParser().parseFromString(html, "text/html");
  const overlay = doc.body.firstElementChild;
  const text = overlay.querySelector(".popup-text");
  text.textContent = nome + " começa";

  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add("show"));

  setTimeout(() => {
    overlay.classList.add("hide");
    setTimeout(() => overlay.remove(), 200);
  }, 850);
}
