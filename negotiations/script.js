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
    if (chats) {
      console.log(chats);
      chats.map((chat) => {
        console.log(chat);
        const singleChatContainer = document.createElement("div");
        singleChatContainer.classList.add("chat-cont");
        const innerCont = document.createElement("div");
        const imgInnerCont = document.createElement("div");
        imgInnerCont.classList.add("img-cont");
        // const imgDiv = document.createElement("div");
        const img = document.createElement("div");
        img.classList.add("letter-img");
        imgInnerCont.appendChild(img);
        imgInnerCont.appendChild(innerCont);
        img.textContent = chat[4].slice(0, 2);
        // img.style.backgroundColor = rgba(0, 0, 250);
        singleChatContainer.dataset.chatId = chat[0];
        let chatId = new URLSearchParams({
          chat_id: singleChatContainer.dataset.chatId,
          username: chat[4],
        });
        singleChatContainer.addEventListener("click", () => {
          window.location = `chat/index.html?${chatId}`;
        });
        const chatName = document.createElement("h3");
        const lastMsg = document.createElement("p");
        const lastMsgTime = document.createElement("p");
        chatName.textContent = chat[4];
        innerCont.appendChild(chatName);
        innerCont.appendChild(lastMsg);
        singleChatContainer.appendChild(imgInnerCont);
        if (chat[3]) {
          lastMsg.textContent = chat[3].msg;
          let time = chat[3].time.split("T:");
          let zone = time[1].slice(8, 11);
          time = time[1].slice(0, 5) + zone.toLowerCase();
          lastMsgTime.textContent = time;
          singleChatContainer.appendChild(lastMsgTime);
        }
        overAllContainer.appendChild(singleChatContainer);
      });
    }
  }

  function generateRgbColors(redValue, blueValue, greenValue) {
    let red = Math.floor(Math.random() * redValue) + 1;
    let blue = Math.floor(Math.random() * blueValue) + 1;
    let green = Math.floor(Math.random() * greenValue) + 1;

    return [red, blue, green];
  }
});
