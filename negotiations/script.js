document.addEventListener("DOMContentLoaded", () => {
  const ip = "http://127.0.0.1:1998";
  // const ip = "https://cryptomarket-server.onrender.com";
  const overAllContainer = document.querySelector(".chat-list-container");
  function fetchChatList() {
    const singleChatContainer = document.createElement("div");
    const para = document.createElement("p");
    para.textContent = "hey there";
    singleChatContainer.appendChild(para);
    overAllContainer.appendChild(singleChatContainer);
    console.log("hi");
  }
  fetchChatList();
});
