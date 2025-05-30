document.addEventListener("DOMContentLoaded", () => {
  const selectAsset = document.querySelector(".select-asset");
  const optionContainer = document.querySelector(".option-container");
  const selectedAsset = document.querySelector(".selected");
  const img = document.querySelector(".asset-img");
  const assetName = document.querySelector(".asset-name");
  const assetSymbol = document.querySelector(".asset-symbol");
  const assetQuantity = document.querySelector(".quantity");
  const avgPrice = document.querySelector(".avg");
  const balance = document.querySelector(".balance");
  const rangeInput = document.getElementById("range");
  const quant = document.querySelector(".quant");
  const symb = document.querySelector(".symb");
  const amountEqualTo = document.querySelector(".amount-equal");
  const speedOptions = document.querySelectorAll(".speed-options >*");
  const selectedTransferSpeed = document.querySelector(".selected-speed");
  const speedOptionContainer = document.querySelector(".speed-options");
  const userWallet = document.querySelector(".from-wallet");
  const clientWallet = document.querySelector(".to-wallet");
  const transFee = document.querySelector(".trans-fee");
  const gasFee = document.querySelector(".gas-fee");
  const totQuantity = document.querySelector(".total-quantity");
  let totPrice = document.querySelector(".total-price");
  const reviewBtn = document.getElementById("reviewButton");
  const transFeesymbol = document.querySelectorAll(".trans-fee-symbol");
  const selectedListedAsset = document.querySelector(".list");
  const ip = "http://127.0.0.1:1998";
  // const ip = "https://cryptomarket-server.onrender.com";

  function updateSellingPage() {
    fetch(`${ip}/profile`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed to fetch");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        userWallet.textContent = data.user_balance.transId;
        updateOptionContainer(data.asset);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  let chos = [];
  function updateOptionContainer(options) {
    selectedAsset.textContent = options[0][0];
    displaySelectedAsset(options[0]);
    selectTransferSpeed(options[0]);
    for (let i = 0; i < options.length; i++) {
      const optionElement = document.createElement("option");
      optionElement.value = options[i][0];
      optionElement.innerText = options[i][0];
      optionElement.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedAsset.textContent = options[i][0];
        displaySelectedAsset(options[i]);
        selectTransferSpeed(options[i]);
        optionContainer.classList.toggle("hide");
      });

      optionContainer.appendChild(optionElement);
    }
  }

  function displaySelectedAsset(asset) {
    console.log(asset);
    img.src = asset[3];
    assetName.textContent = asset[0];
    assetSymbol.textContent = asset[1];
    assetQuantity.textContent = ` ${asset[4].toFixed(4)} ${asset[1]}`;
    avgPrice.textContent = asset[6].toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    balance.textContent = assetQuantity.textContent;
    rangeInput.min = 0;
    rangeInput.max = asset[5];
    rangeInput.value = asset[5];
    symb.textContent = asset[1];
    quant.textContent = Number(asset[4].toFixed(4));
    amountEqualTo.textContent = asset[5].toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    rangeInput.addEventListener("input", () => {
      let processQuantity = (
        (Number(rangeInput.value) * asset[4]) /
        asset[5]
      ).toFixed(3);
      quant.textContent = processQuantity;
      amountEqualTo.textContent = Number(rangeInput.value).toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "USD",
        }
      );
      setTransferFee(asset);
      console.log(selectedTransferSpeed.dataset.selectedValue);
    });
  }
  selectAsset.addEventListener("click", () => {
    optionContainer.classList.toggle("hide");
  });
  updateSellingPage();
  function selectTransferSpeed(asset) {
    selectedTransferSpeed.textContent = speedOptions[0].textContent;
    selectedTransferSpeed.dataset.selectedValue = speedOptions[0].value;
    setTransferFee(asset);
    speedOptions.forEach((element) => {
      element.addEventListener("click", () => {
        selectedTransferSpeed.textContent = element.textContent;
        selectedTransferSpeed.dataset.selectedValue = element.value;
        speedOptionContainer.classList.toggle("hide");
        setTransferFee(asset);
      });
    });
  }
  function setTransferFee(asset) {
    console.log(asset);
    transFee.textContent = `${Number(
      0.0001 * selectedTransferSpeed.dataset.selectedValue
    ).toFixed(4)}`;
    transFeesymbol.forEach((symb) => {
      symb.textContent = asset[1];
    });
    let fee = Number(selectedTransferSpeed.dataset.selectedValue);
    gasFee.textContent = `(${fee.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })})`;

    totQuantity.textContent = `${(
      Number(fee * 0.0001) + Number(quant.textContent)
    ).toFixed(4)}`;
    totPrice.textContent = `(${Number(
      fee + Number(rangeInput.value)
    ).toLocaleString("en-US", { style: "currency", currency: "USD" })})`;
    reviewBtn.addEventListener("click", () => {
      let review = new URLSearchParams({
        amount: rangeInput.value,
        assetDet: asset,
        quantity: quant.textContent,
        maxQuan: totQuantity.textContent,
        maxPrice: totPrice.textContent,
        gasFee: gasFee.textContent,
        gasQuanFee: transFee.textContent,
        wallet: userWallet.textContent,
        clientWallet: clientWallet.value,
        transRate: selectedTransferSpeed.dataset.selectedValue,
        transType: "sell",
      });
      window.location = `review.html?${review.toString()}`;
    });
    console.log(asset);
    selectedListedAsset.addEventListener("click", () => {
      let review = new URLSearchParams({
        amount: rangeInput.value,
        assetDet: asset,
        quantity: quant.textContent,
        maxQuan: totQuantity.textContent,
        maxPrice: totPrice.textContent,
        gasFee: gasFee.textContent,
        gasQuanFee: transFee.textContent,
        wallet: userWallet.textContent,
        clientWallet: clientWallet.value,
        transRate: selectedTransferSpeed.dataset.selectedValue,
        transType: "list",
      });
      window.location = `review.html?${review.toString()}`;
    });
  }
  selectedTransferSpeed.addEventListener("click", () => {
    speedOptionContainer.classList.toggle("hide");
  });
});
