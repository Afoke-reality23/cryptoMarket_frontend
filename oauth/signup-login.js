const urlParams = new URLSearchParams(window.location.search);
const clientEmail = urlParams.get("email");
const route = urlParams.get("route");
console.log(route);
const password = document.getElementById("password");
const email = document.getElementById("email");
const form = document.getElementById("form");
email.value = clientEmail;
email.innerText = clientEmail;
// const ip = "http://127.0.0.1:1998";
const ip = "https://cryptomarket-server.onrender.com";
form.addEventListener("submit", (e) => {
  e.preventDefault();
  processAuthentication(email.value, password.value);
});
function processAuthentication(email, password) {
  fetch(`${ip}/frontend/oauth/${route}/password/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("fail to fetch");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (
        data.status === "Registered" ||
        data.status === "Not Found" ||
        data.status === "Invalid Credential"
      ) {
        window.location.href = `../index.html?response=${data.response}`;
      } else {
        window.location = `../index.html`;
        // window.location = `../../dashboard.html`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
