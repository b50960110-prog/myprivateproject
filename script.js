// Jargon AI - script.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Jargon AI loaded");

  // Try to find chat elements if they exist in index.html
  const sendBtn = document.getElementById("sendBtn");
  const chatInput = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");

  if (sendBtn && chatInput && chatBox) {
    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;
      chatBox.innerHTML += `<div class="user-msg">${text}</div>`;
      chatInput.value = "";
      // Demo reply - replace later with real AI API
      setTimeout(() => {
        chatBox.innerHTML += `<div class="ai-msg">Jargon AI: I got your message - "${text}". Connect an AI API to get a real answer.</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 500);
    };
    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
});
