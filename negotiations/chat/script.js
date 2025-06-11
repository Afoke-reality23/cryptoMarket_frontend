document.addEventListener("DOMContentLoaded", () => {
  // const ip = "http://127.0.0.1:1998";
  const ip = "https://cryptomarket-server.onrender.com";
  // const chatIp = "wss://cryptomarket-server.onrender.com";
  // const chatIp = "ws://127.0.0.1:19991/chat?";
  const urlParam = new URLSearchParams(window.location.search);
  const imgDiv = document.querySelector(".img");
  const user = document.querySelector(".username");
  let chatId = urlParam.get("chat_id");
  let username = urlParam.get("username");
  console.log(chatId);
  const mainContainer = document.querySelector(".message-body");
  const textBox = document.querySelector(".text-box");
  const sendBtn = document.getElementById("send");
  const menuBtn = document.querySelector(".menu");
  const menuTab = document.querySelector(".menu-tab");
  const complete = document.getElementById("complete");
  const cancel = document.getElementById("cancel");

  menuBtn.addEventListener("click", () => {
    menuTab.classList.toggle("hide");
  });
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
        if (username) {
          imgDiv.textContent = username.slice(0, 2);
        }
        let userId = data.user_id;
        user.textContent = username;
        populateChat(data.message, userId);
        let recieverId =
          userId === data.buyer_id ? data.seller_id : data.buyer_id;
        complete.addEventListener("click", () => {
          boughtAsset = {
            chat_id: chatId,
            sellerId: Number(recieverId),
          };
          purchaseListedAsset(boughtAsset);
        });
        const ws = new WebSocket(
          `wss://cryptomarket-chat-server.onrender.com/chat?user_id=${userId}`
        );
        // const ws = new WebSocket(`ws://127.0.0.1:1991/chat?user_id=${userId}`);
        ws.onopen = () => console.log("connected");
        ws.onmessage = (e) => {
          console.log(e.data);
          let chat = JSON.parse(e.data);
          const chatContainer = document.createElement("div");
          const para = document.createElement("p");
          chatContainer.classList.add(
            `${chat.sender === userId ? "sender" : "reciever"}`
          );
          para.textContent = chat.msg;
          chatContainer.appendChild(para);
          mainContainer.appendChild(chatContainer);
          let nearBottom = isNearBottom();
          if (nearBottom) {
            console.log("true");
            mainContainer.scrollTop = mainContainer.scrollHeight;
          }
        };
        sendBtn.addEventListener("click", () => {
          if (ws.readyState == WebSocket.OPEN) {
            let message = {
              recieverId: recieverId.toString(),
              senderId: userId,
              message: { chatId: chatId },
            };
            message.message.msg = textBox.value;
            message.message.sender = userId;
            // message.message.readStatus = "seen";
            const chatContainer = document.createElement("div");
            const para = document.createElement("p");
            chatContainer.classList.add(
              `${message.message.sender === userId ? "sender" : "reciever"}`
            );
            para.textContent = message.message.msg;
            chatContainer.appendChild(para);
            mainContainer.appendChild(chatContainer);
            let nearBottom = isNearBottom();
            if (nearBottom) {
              mainContainer.scrollTop = mainContainer.scrollHeight;
            }
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
    mainContainer.scrollTop = mainContainer.scrollHeight;
    console.log(mainContainer.scrollTop);
  }
  function isNearBottom(offset = 100) {
    return (
      mainContainer.scrollHeight -
        mainContainer.scrollTop -
        mainContainer.clientHeight <
      offset
    );
  }
  async function purchaseListedAsset(data) {
    try {
      const buy = await fetch(`${ip}/buy-listed`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const buyResult = await buy.json();
      console.log(buyResult);
      if (buyResult.status === "successfull") {
        console.log("inside already");
        const para = document.createElement("p");
        para.textContent = "transaction complete";
        para.classList.add("status");
        mainContainer.appendChild(para);
        console.log("para added");
      }
    } catch (error) {
      console.error(error);
    }
  }
});
