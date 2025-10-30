import confetti from "canvas-confetti";

export function launchFireworks(total = 10) {
  const duration = 4000; // 4 seconds
  const end = Date.now() + duration;

  // 🎆 Fireworks burst animation
  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ffffff"],
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ffffff"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  // 🎉 Emoji celebration layer
  let emojis = ["🎉", "🎊", "✨", "🥳"];
  if (total >= 20) emojis.push("🌈", "🌟", "💫");
  if (total >= 50) emojis.push("🦄", "🐾", "😺");

  function showEmoji() {
    const e = document.createElement("div");
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.position = "fixed";
    e.style.fontSize = 40 + Math.random() * 30 + "px";
    e.style.left = Math.random() * window.innerWidth + "px";
    e.style.top = Math.random() * window.innerHeight + "px";
    e.style.zIndex = 10000;
    e.style.transition = "transform 2s ease-out, opacity 2s ease-out";
    e.style.pointerEvents = "none";
    document.body.appendChild(e);

    setTimeout(() => {
      const dx = (Math.random() - 0.5) * 400;
      const dy = (Math.random() - 0.5) * 400;
      e.style.transform = `translate(${dx}px, ${dy}px) scale(1.2) rotate(${Math.random() * 360}deg)`;
      e.style.opacity = 0;
    }, 100);

    setTimeout(() => e.remove(), 2500);
  }

  (function emojiLoop() {
    showEmoji();
    if (Date.now() < end) setTimeout(emojiLoop, 200 + Math.random() * 200);
  })();
}
