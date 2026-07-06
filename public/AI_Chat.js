const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");

const conversationHistory = [
  {
    role: "system",
    content: "You are AI Study Buddy, a helpful study assistant for university students. Answer questions clearly and concisely. Explain concepts step by step when needed, and keep responses easy to understand."
  }
];

function appendMessage(text, role) {
  const row = document.createElement("div");
  row.className = `msg-row ${role === "user" ? "user-row" : "bot-row"}`;
  const bubble = document.createElement("p");
  bubble.className = role === "user" ? "user" : "bot";

  if (role === "bot") {
    bubble.innerHTML = marked.parse(text);
  } else {
    bubble.textContent = text;
  }

  row.appendChild(bubble);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  return bubble;
}

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, "user");
  input.value = "";
  sendBtn.disabled = true;

  const thinkingBubble = appendMessage("Thinking... ", "bot");
  thinkingBubble.classList.add("thinking");

  conversationHistory.push({ role: "user", content: userText });

  try {
    const response = await fetch("/api/groq-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Chat API error:", data);
      thinkingBubble.textContent = `Error: ${data?.error || "Something went wrong. Check the console (F12)."}`;
      thinkingBubble.classList.remove("thinking");
      conversationHistory.pop();
    } else {
      const reply = data?.reply || "I couldn't generate a response. Try again.";
      thinkingBubble.innerHTML = marked.parse(reply);
      thinkingBubble.classList.remove("thinking");
      conversationHistory.push({ role: "assistant", content: reply });
    }
  } catch (error) {
    thinkingBubble.textContent = "Network error. Please check your connection and try again.";
    thinkingBubble.classList.remove("thinking");
    conversationHistory.pop();
    console.error("Chat request failed:", error);
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (typeof requireLogin === "function" && !requireLogin("Send Message")) return;
    sendMessage();
  }
});

sendBtn.addEventListener("click", () => {
  if (typeof requireLogin === "function" && !requireLogin("Send Message")) return;
  sendMessage();
});
