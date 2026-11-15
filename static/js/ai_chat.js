function csrfToken() {
    var m = document.querySelector('meta[name="csrf-token"]');
    return m ? m.content : "";
}

let chatBusy = false;

function addChatMessage(text, cssClass) {
    const chatBox = document.getElementById("chat-box");
    const div = document.createElement("div");
    div.className = "chat-message " + cssClass;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
}

async function sendChatMessage() {

    if (chatBusy) {
        return;
    }

    const T = window.I18N || {};
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send");
    const message = input.value.trim();

    if (message === "") {
        return;
    }

    addChatMessage(message, "user-message");
    input.value = "";

    const loadingDiv = addChatMessage(T.js_typing || "...", "bot-message");

    chatBusy = true;
    sendBtn.disabled = true;

    try {
        const response = await fetch("/ai_chat_api", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRFToken": csrfToken() },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (data.status === "success") {
            loadingDiv.textContent = data.reply;
        } else {
            loadingDiv.textContent = data.message || T.js_ai_error || "Error";
        }

    } catch (error) {
        loadingDiv.textContent = T.js_conn_error || "Connection error";
    }

    chatBusy = false;
    sendBtn.disabled = false;
    input.focus();

    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("chat-input");
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendChatMessage();
        }
    });
});
