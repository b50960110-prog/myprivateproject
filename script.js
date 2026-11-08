document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("messageInput");
  const messages = document.getElementById("messages");
  if (!form || !input || !messages) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    messages.innerHTML += `<div class="user-msg">${text}</div>`;
    input.value = "";
    setTimeout(() => {
      messages.innerHTML += `<div class="ai-msg">Jargon AI: I got your message - "${text}".</div>`;
      messages.scrollTop = messages.scrollHeight;
    }, 500);
  });
});
