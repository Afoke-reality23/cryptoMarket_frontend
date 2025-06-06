document.addEventListener("DOMContentLoaded", () => {
  // const ip = "http://127.0.0.1:1998";
  const ip = "https://cryptomarket-server.onrender.com";
  const overAllContainer = document.querySelector(".chat-list-container");
  function fetchChatList() {
    fetch(`${ip}/chat`, {
      method: "Get",
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
        listChat(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  fetchChatList();
  function listChat(chats) {
    chats.map((chat) => {
      console.log(chat);
      const singleChatContainer = document.createElement("div");
      singleChatContainer.dataset.chatId = chat[0];
      console.log(singleChatContainer.dataset.chatId);
      let chatId = new URLSearchParams({
        chat_id: singleChatContainer.dataset.chatId,
      });
      singleChatContainer.addEventListener("click", () => {
        window.location = `chat/index.html?${chatId}`;
      });
      const para = document.createElement("p");
      para.textContent = chat[4];
      singleChatContainer.appendChild(para);
      overAllContainer.appendChild(singleChatContainer);
    });
  }
});
