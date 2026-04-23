function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");

  if (input.value.trim() === "") return;

  // User message
  const userMsg = document.createElement("p");
  userMsg.className = "user";
  userMsg.textContent = input.value;
  chatBox.appendChild(userMsg);

  // Fake AI reply (for now)
  const botMsg = document.createElement("p");
  botMsg.className = "bot";
  botMsg.textContent = "Thinking... 🤔";
  chatBox.appendChild(botMsg);

  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
