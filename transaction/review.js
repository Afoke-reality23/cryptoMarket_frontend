const urparam = new URLSearchParams(window.location.search);
const rcvQuanity = urparam.get("quantity");
const transRate = urparam.get("transRate");
const tType = urparam.get("transType");
console.log(tType);
console.log(transRate);
const rcvSymbol = urparam.get("assetDet");
const amount = urparam.get("amount");
const asset = rcvSymbol.split(",");
console.log(rcvQuanity);
const from = urparam.get("wallet");
const to = urparam.get("clientWallet");
const transFQuan = urparam.get("gasQuanFee");
const transFee = urparam.get("gasFee");
const maxQuan = urparam.get("maxQuan");
const maxPrice = urparam.get("maxPrice");
const transQuantity = document.querySelector(".quantity");
const transQuantitySymbol = document.querySelector(".symbol");
const sendingPara = document.querySelector(".sending");
const senderWallet = document.querySelector(".sender-wallet");
const recieverWallet = document.querySelector(".reciever-wallet");
const reviewQuantity = document.querySelector(".rev-quantity");
const gasFeeQuantity = document.querySelector(".gas-fee-quantity");
const gasFee = document.querySelector(".gas-fee");
const totQuantity = document.querySelector(".max-quan");
const totPrice = document.querySelector(".max-price");
const gasFeeSymbol = document.querySelectorAll(".gas-fee-symbol");
const price = document.querySelector(".price");
const cancel = document.getElementById("reject");
const confrim = document.getElementById("confirm");
transQuantity.textContent = rcvQuanity;
transQuantitySymbol.textContent = asset[1];
sendingPara.textContent += ` ${asset[1]}`;
senderWallet.textContent = from;
recieverWallet.textContent = to;
reviewQuantity.textContent = `${rcvQuanity} ${asset[1]}`;
gasFeeQuantity.textContent = transFQuan;
gasFee.textContent = transFee.replace(/[()]+/g, "");
totQuantity.textContent = maxQuan;
totPrice.textContent = maxPrice.replace(/[()]+/g, "");
gasFeeSymbol.forEach((sym) => {
  sym.textContent = asset[1];
});
price.textContent = Number(amount).toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
});
confrim.addEventListener("click", () => {
  if (tType === "sell") {
    confirmTransaction();
  } else {
    listAsset();
  }
});
cancel.addEventListener("click", () => {
  window.location = "index.html";
});
const sellAsset = {
  trans_quantity: Number(totQuantity.textContent),
  asset_id: asset[7],
  trans_price: Number(totPrice.textContent.replace(/[()$,]+/g, "")),
  processing_speed: Number(transRate),
  reciever_wallet: to,
};
const listAssetObj = {
  asset_id: asset[7],
  state: "listed",
  set_price: Number(amount),
  quantity: Number(rcvQuanity),
  processing_speed: Number(transRate),
};
// console.log(sellAsset);
// const ip = "http://127.0.0.1:1998";
const ip = "https://cryptomarket-server.onrender.com";
function confirmTransaction() {
  fetch(`${ip}/sell`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/josn",
    },
    body: JSON.stringify(sellAsset),
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
      window.location = "../portfolio/index.html";
    })
    .catch((error) => {
      console.error(error);
    });
}

function listAsset() {
  fetch(`${ip}/market-listing`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listAssetObj),
  })
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(`Error:${resp.statusText}`);
      } else {
        return resp.json();
      }
    })
    .then((data) => {
      if (data.status === "success") {
        window.location = `../portfolio/index.html`;
      } else {
        console.log("sorry something went wrong !!!!");
      }
    });
}
