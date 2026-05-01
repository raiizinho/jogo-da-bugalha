export async function mostrarTelaVencedor({
  titulo,
  placar,
  aoContinuar,
  aoVoltarInicio,
}) {
  document.querySelector(".winner-overlay")?.remove();

  const res = await fetch("./styles/html/winnerModal.html");
  if (!res.ok) throw new Error("Erro ao carregar HTML");

  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const overlay = doc.body.firstElementChild;

  overlay.querySelector(".winner-title").textContent = titulo;
  overlay.querySelector(".winner-scoreline").textContent = placar;
  overlay
    .querySelector('[data-winner-action="continue"]')
    .addEventListener("click", () => {
      overlay.classList.add("hide");
      setTimeout(() => {
        overlay.remove();
        aoContinuar();
      }, 220);
    });
  overlay
    .querySelector('[data-winner-action="restart"]')
    .addEventListener("click", () => {
      overlay.classList.add("hide");
      setTimeout(() => {
        overlay.remove();
        aoVoltarInicio();
      }, 220);
    });

  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add("show"));
}
