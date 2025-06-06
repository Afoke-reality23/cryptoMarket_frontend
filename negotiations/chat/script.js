document.addEventListener("DOMContentLoaded", () => {
  // const ip = "http://127.0.0.1:1998";
  const ip = "https://cryptomarket-server.onrender.com";
  const chatIp = "wss://cryptomarket-server.onrender.com";
  // const chatIp = "ws://127.0.0.1:19991";
  const urlParam = new URLSearchParams(window.location.search);
  let chatId = urlParam.get("chat_id");
  console.log(chatId);
  const mainContainer = document.querySelector(".message-body");
  const textBox = document.querySelector(".text-box");
  const sendBtn = document.getElementById("send");
  fetchSelectedChat();
  function fetchSelectedChat() {
    fetch(`${ip}/chat?chat_id=${chatId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error:${response.statusText}`);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        let userId = data.user_id;
        populateChat(data.message, userId);
        let recieverId =
          userId === data.buyer_id ? data.seller_id : data.buyer_id;
        const ws = new WebSocket("wss://cryptomarket-server.onrender.com");
        ws.onopen = () => console.log("connected");
        ws.onmessage = (e) => {
          let chat = JSON.parse(e.data);
          const chatContainer = document.createElement("div");
          const para = document.createElement("p");
          chatContainer.classList.add(
            `${chat.sender === userId ? "sender" : "reciever"}`
          );
          para.textContent = chat.msg;
          chatContainer.appendChild(para);
          mainContainer.appendChild(chatContainer);
        };
        sendUserIdToChatServer(ws, userId);
        sendBtn.addEventListener("click", () => {
          if (ws.readyState == WebSocket.OPEN) {
            let message = {
              recieverId: recieverId,
              senderId: userId,
              message: { chatId: chatId },
            };
            message.message.msg = textBox.value;
            message.message.sender = userId;
            const chatContainer = document.createElement("div");
            const para = document.createElement("p");
            chatContainer.classList.add(
              `${message.message.sender === userId ? "sender" : "reciever"}`
            );
            para.textContent = message.message.msg;
            chatContainer.appendChild(para);
            mainContainer.appendChild(chatContainer);
            ws.send(JSON.stringify(message));
            textBox.value = " ";
          } else {
            console.log("websocket not opened yet");
          }
        });
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
  function populateChat(chats, userId) {
    chats.map((chat) => {
      const chatContainer = document.createElement("div");
      const para = document.createElement("p");
      chatContainer.classList.add(
        `${chat.sender === userId ? "sender" : "reciever"}`
      );
      para.textContent = chat.msg;
      chatContainer.appendChild(para);
      mainContainer.appendChild(chatContainer);
    });
  }
  function sendUserIdToChatServer(ws, userId) {
    setTimeout(() => {
      if (ws.readyState == WebSocket.OPEN) {
        ws.send(JSON.stringify({ userId: userId }));
      } else {
        console.log("webSocket not ready");
      }
    }, 200);
  }
});
