document.addEventListener("DOMContentLoaded", () => {
  const ip = "http://127.0.0.1:1998";
  // const ip = "https://cryptomarket-server.onrender.com";
  const urlParam = new URLSearchParams(window.location.search);
  let chatDetails = urlParam.get("assetChatDetails");
  try {
    chatDetails = JSON.parse(chatDetails);
    console.log(chatDetails.chat_id);
  } catch (e) {
    console.error("invalid json in chatDetails");
  }
  fetchSelectedChat();
  function fetchSelectedChat() {
    fetch(`${ip}/chat?chat_id=${chatDetails.chat_id}`, {
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
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
});
