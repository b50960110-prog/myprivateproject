document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatForm");
  const input = document.getElementById("messageInput");
  const messages = document.getElementById("messages");
  if (!form || !input || !messages) return;

  let lastAnswer = "", uploadedText = "";
  function setStatus(t){ document.getElementById("status").innerText = t; }
  function speakText(t){ try{ speechSynthesis.cancel(); let u=new SpeechSynthesisUtterance(t); u.lang="en-KE"; speechSynthesis.speak(u);}catch(e){} }
  function makePDF(){
    if(!lastAnswer){ alert("Ask something first"); return; }
    let w=window.open("","_blank");
    w.document.write("<html><body style='font-family:Arial;padding:20px'><h2>Jargon AI Answer</h2><p>"+lastAnswer+"</p><script>window.print()<\/script></body></html>");
    w.document.close();
  }
  function solveMaths(q){
    try{ let c=q.replace(/x/g,"*"); if(/^[0-9+\-*/(). ]+$/.test(c)){ let r=eval(c); if(!isNaN(r)) return q+" = <b>"+r+"</b>"; } }catch(e){}
    return null;
  }
  async function askAI(question){
    try{
      let res=await fetch("https://text.pollinations.ai/"+encodeURIComponent("You are Jargon AI from Eldoret, Kenya. Answer simply. "+uploadedText+" Question: "+question));
      let t=await res.text(); if(t && t.length>2) return t;
    }catch(e){}
    return null;
  }
  async function doSend(isVoice){
    let q=input.value.trim();
    if(!q && !uploadedText){ setStatus("Type something first!"); return; }
    if(!q) q="Explain this file/photo";
    messages.innerHTML+='<div class="user-msg">You: '+q+'</div>';
    input.value=""; setStatus("Thinking... 🤔");
    messages.innerHTML+='<div class="ai-msg" id="thinking"><div class="avatar">🤖</div><div class="bubble"><b>Jargon AI:</b> Thinking... 🤔</div></div>';
    let m=solveMaths(q);
    let think=document.getElementById("thinking");
    if(m){ lastAnswer=m; think.innerHTML="<div class='avatar'>🤖</div><div class='bubble'><b>Jargon AI:</b> "+m+"</div>"; setStatus("Done ✅"); if(isVoice) speakText(m); return; }
    let answer=await askAI(q);
    if(!answer){
      try{ let r=await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(q)); let d=await r.json(); if(d.extract) answer=d.extract.split(". ").slice(0,3).join(". ")+"."; else answer="Sorry, try again."; }catch(e){ answer="Sorry, no internet. Check bundles."; }
    }
    uploadedText=""; document.getElementById("preview").innerHTML="";
    lastAnswer=answer; think.innerHTML="<div class='avatar'>🤖</div><div class='bubble'><b>Jargon AI:</b> "+answer+"<br><br><button onclick='window.makePDF()'>📄 Make PDF</button></div>";
    setStatus("Done ✅"); if(isVoice) speakText(answer);
  }
  window.makePDF=makePDF;
  form.addEventListener("submit", (e)=>{ e.preventDefault(); doSend(false); });
  document.getElementById("voiceBtn").addEventListener("click", ()=>{
    let SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ alert("Voice needs Chrome. Open in Chrome, not WhatsApp."); return; }
    let r=new SR(); r.lang="en-KE"; setStatus("🎤 Listening... Speak now..."); r.start();
    r.onresult=(e)=>{ input.value=e.results[0][0].transcript; doSend(true); };
    r.onerror=()=>{ setStatus("Voice error: Tap ALLOW for mic"); alert("Allow microphone: Chrome > Lock 🔒 > Microphone > Allow"); };
  });
  document.getElementById("pdfBtn").addEventListener("click", makePDF);
  document.getElementById("readBtn").addEventListener("click", ()=> speakText(lastAnswer||"Ask me something first"));
  document.getElementById("copyBtn").addEventListener("click", ()=>{ if(!lastAnswer){alert("Ask first");return;} navigator.clipboard.writeText(lastAnswer); alert("Copied!"); });
  function handleFile(f){
    if(!f) return;
    if(f.type.startsWith("image/")){
      let rd=new FileReader(); rd.onload=(e)=>{ document.getElementById("preview").innerHTML="<img src='"+e.target.result+"'><br><small>Photo: "+f.name+"</small>"; }; rd.readAsDataURL(f);
      uploadedText="User uploaded photo "+f.name+". Help with it.";
    }else{
      let rd=new FileReader(); rd.onload=(e)=>{ document.getElementById("preview").innerHTML="<small>📎 File: "+f.name+"</small>"; uploadedText="File "+f.name+" content: "+e.target.result.substring(0,3000); }; rd.readAsText(f);
    }
    messages.innerHTML+='<div class="user-msg">You attached: '+f.name+'</div>';
    setStatus("File attached ✅ Now type question + Send");
  }
  document.getElementById("fileBtn").addEventListener("click", ()=> document.getElementById("fileInput").click());
  document.getElementById("photoBtn").addEventListener("click", ()=> document.getElementById("photoInput").click());
  document.getElementById("camBtn").addEventListener("click", ()=> document.getElementById("camInput").click());
  document.getElementById("fileInput").addEventListener("change", function(){ handleFile(this.files[0]); });
  document.getElementById("photoInput").addEventListener("change", function(){ handleFile(this.files[0]); });
  document.getElementById("camInput").addEventListener("change", function(){ handleFile(this.files[0]); });
});
