document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("messageInput") || document.getElementById("message");
  const messages = document.getElementById("messages");

  if (!form || !input || !messages) return;

  // Load saved key into box if it exists
  const keyBox = document.getElementById("key");
  if (keyBox && localStorage.getItem("jargon_key")) {
    keyBox.value = localStorage.getItem("jargon_key");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    messages.innerHTML += `<div class="user-msg">${text}</div>`;
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    // Show thinking
    messages.innerHTML += `<div class="ai-msg" id="thinking">Thinking... 🤔</div>`;

    let reply = await askGemini(text);

    document.getElementById("thinking").remove();
    messages.innerHTML += `<div class="ai-msg">${reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
  });
});

// === API CODE - THIS IS WHERE API GOES ===
async function askGemini(question){
  let API_KEY = localStorage.getItem("jargon_key");
  if(!API_KEY) return "Please paste your API Key first! Tap 'Get Free Key' at the top.";
  try {
    let res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+API_KEY,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({contents:[{parts:[{text:"You are Jargon AI from Eldoret, Kenya. Answer simply for a Kenyan student. Question: "+question}]}]})
    });
    let data = await res.json();
    if(data.error) return "Error: "+data.error.message;
    return data.candidates[0].content.parts[0].text;
  } catch(e){
    return "Error: "+e;
  }
}

function saveKey(){
  let k = document.getElementById("key").value.trim();
  localStorage.setItem("jargon_key", k);
  alert("Key Saved! Now ask anything.");
}
