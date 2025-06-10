const form = document.getElementById("form");
const google = document.getElementById("google");
const email = document.getElementById("email");
const emailError = document.querySelector(".email-error");
const urlParams = new URLSearchParams(window.location.search);
const emailErrorMessage = urlParams.get("response");
const ip = "http://127.0.0.1:1998";
// const ip = "https://cryptomarket-server.onrender.com";

if (emailErrorMessage) {
  displayErrorMessage(emailErrorMessage);
}
function displayErrorMessage(message) {
  console.log(emailError);
  emailError.textContent = message;
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let href = window.location;
  // console.log(href);
  let pattern = /login|create-account/;
  let route = pattern.exec(href)[0];
  console.log(route);
  console.log(emailError);
  window.location.href = `password/index.html?email=${email.value}&route=${route}`;
});
google.addEventListener("submit", (e) => {
  e.preventDefault();
  tiggerSignInWithGoogle();
});
function tiggerSignInWithGoogle() {
  const clientId =
    "302530047469-dg8a9s8vev2iuou88gkfifg7cu2mran1.apps.googleusercontent.com";
  const redirect_url = `${ip}/auth/google/callback`;
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirect_url}&response_type=code&scope=openid%20email%20profile&access_type=offline`;
}

// function navigateToPasswordPage()P
// const email = document.getElementById("email");
// const userName = document.getElementById("user-name");
// const password = document.getElementById("password");
// const confrimPass = document.getElementById("confirm-pass");
// const form = document.getElementById("form");
// const terms = document.getElementById("terms");
// // const ip = "192.168.175.2";
// const ip = "127.0.0.1";
// // const ip = "localhost";
// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   formValidation(
//     email.value,
//     userName.value,
//     password.value,
//     confrimPass.value,
//     e,
//     terms.value,
//     ip
//   );
// });
// let debouncer;
// let usernameStatus;
// userName.addEventListener("input", () => {
//   let error = document.querySelector(".user-name-error");
//   const pattern = /^[^\s]+$/;
//   const user = pattern.exec(userName.value);
//   if (user) {
//     clearTimeout(debouncer);
//     debouncer = setTimeout(() => {
//       const loader = document.querySelector(".loader");
//       const loader2 = document.querySelector(".loader2");

//       loader.classList.toggle("toggle-loader");
//       loader2.classList.toggle("toggle-loader");
//       console.log("aout to");
//       fetch(`${ip}/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           tableName: "users",
//           prop: {
//             username: userName.value,
//           },
//         }),
//         credentials: "include",
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("failed to fetch");
//           } else {
//             return response.json();
//           }
//         })
//         .then((data) => {
//           console.log(data);
//           usernameStatus = data;
//           if (data.status == "unavaliable") {
//             error.textContent = data.response;
//             error.style.color = "red";
//           } else {
//             let error = document.querySelector(".user-name-error");
//             error.textContent =
//               userName.value.length === 0 ? "" : data.response;
//             error.style.color = "green";
//           }
//           loader.classList.toggle("toggle-loader");
//           loader2.classList.toggle("toggle-loader");
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }, 100);
//   } else {
//     error.textContent =
//       userName.value.length === 0
//         ? ""
//         : "Username cannot contain spaces or tabs";
//     error.style.color = "red";
//   }
// });

// function formValidation(email, user, pass, confirm, e, terms, ip) {
//   if (pass === confirm) {
//     signup(email, user, pass, terms, ip);
//   } else {
//     e.preventDefault();
//     let error = document.querySelector(".password-error");
//     error.textContent = "password does not match";
//     return;
//   }
// }

// function signup(email, user, pass, terms, ip) {
//   const emailError = document.querySelector(".email-error");
//   if (usernameStatus.status === "unavaliable") {
//     return;
//   }
//   fetch(`${ip}/users`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       tableName: "users",
//       prop: {
//         email: email,
//         userName: user,
//         password: pass,
//         terms: terms,
//       },
//     }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("failed to fetch");
//       } else {
//         return response.json();
//       }
//     })
//     .then((data) => {
//       if (data.status == "registered") {
//         emailError.textContent = data.response;
//         emailError.style.color = "red";
//       } else if (data.status === "unregistered") {
//         console.log("redirecting...");
//         window.location = "../index.html";
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }
