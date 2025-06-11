document.addEventListener("DOMContentLoaded", () => {
  // const ip = "http://127.0.0.1:1998";
  const ip = "https://cryptomarket-server.onrender.com";
  const userName = document.querySelector(".username");
  const balance = document.querySelector(".balance");
  const assetTotalValue = document.querySelector(".tot-value");
  const container = document.querySelector(".asset-container");
  const activityContainer = document.querySelector(".activity-container");
  const seeAllAsset = document.querySelector(".all-asset");
  const seeAllActivity = document.querySelector(".all-activity");
  const logOutBtn = document.getElementById("logout");

  logOutBtn.addEventListener("click", () => {
    fetch(`${ip}/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`logout Error:${response.statusText}`);
      } else {
        window.location = "../index.html";
      }
    });
  });
  let toBeSoldAsset;
  updateSellingPage();
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
        console.log(data.asset);
        displayBalance(data.user_balance, data.total_value);
        addHolding(data.asset);
        let sold = data.asset;

        donutChart(data.asset, data.total_value);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  function donutChart(assets, totalValue) {
    console.log(assets);
    const donutSeries = [];
    const donutLabls = [];
    for (const asset of assets) {
      const assetPercent = Number(((asset[6] / totalValue) * 100).toFixed(2));
      donutSeries.push(assetPercent);
      donutLabls.push(asset[1]);
    }
    console.log(donutSeries, donutLabls);
    let options = {
      chart: {
        type: "donut",
      },
      series: donutSeries,
      labels: donutLabls,
      plotOptions: {
        pie: {
          expandOnClick: true,
        },
      },
    };

    const chart = new ApexCharts(
      document.getElementById("donutChart"),
      options
    );
    chart.render();
  }
  function fetchTransactionHistory() {
    fetch(`${ip}/transaction`, {
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
        displayAllHistory(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  fetchTransactionHistory();
  function displayAllHistory(histories) {
    if (histories.length > 0) {
      for (const history of histories) {
        // console.log(history);
        const activity = document.createElement("div");
        const logoAssetInfoDiv = document.createElement("div");
        const assetQuantity = document.createElement("p");
        const logo = document.createElement("div");
        const img = document.createElement("img");
        const assetInfoDiv = document.createElement("div");
        const transactType = document.createElement("p");
        const date = document.createElement("p");
        // img.src = history[5];
        logo.appendChild(img);
        logo.classList.add("logo");
        transactType.textContent =
          history[4] === "buy" ? `Bought ${history[0]}` : `Sold ${history[0]}`;
        const dateObj = new Date(history[6].replace(" ", "T"));
        const options = {
          day: "2-digit",
          year: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };
        date.textContent = dateObj.toLocaleString("en-GB", options); // or .toLocaleDateString(), etc.
        date.classList.add("date");
        assetInfoDiv.appendChild(transactType);
        assetInfoDiv.appendChild(date);
        assetInfoDiv.classList.add("trans-type-date");
        logoAssetInfoDiv.appendChild(logo);
        logoAssetInfoDiv.appendChild(assetInfoDiv);
        logoAssetInfoDiv.classList.add("log-trans-type");
        assetQuantity.textContent = history[2].toFixed(4) + history[1];
        activity.appendChild(logoAssetInfoDiv);
        activity.appendChild(assetQuantity);
        activity.classList.add("activity");
        activityContainer.appendChild(activity);
      }
      histories.length > 3
        ? seeAllActivity.classList.toggle("show")
        : (seeAllActivity.style.display = "none");
    } else {
      const seeAll = document.querySelector(".all-activity");
      seeAll.style.display = "none";
      const para = document.createElement("p");
      para.classList.add("empty");
      para.textContent = "you Dont have transaction history yet";
      activityContainer.appendChild(para);
      activityContainer.classList.toggle("empty-container");
    }
  }
  function displayBalance(balanceData, totalValueData) {
    balance.textContent = balanceData.balance.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    userName.textContent = balanceData.username;
    assetTotalValue.textContent = totalValueData.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  function addHolding(info) {
    toBeSoldAsset = info;
    if (info.length > 0) {
      for (const data of info) {
        currentValue = data[2] * data[4];
        const unrealizedGain = currentValue - Number(data[5].toPrecision(6));
        const percentChange = Number(
          ((unrealizedGain / Number(data[5].toPrecision(6))) * 100).toFixed(3)
        );
        const asset = document.createElement("div");
        const astLogo = document.createElement("div");
        const imgDiv = document.createElement("div");
        const img = document.createElement("img");
        const nameSymbol = document.createElement("div");
        const name = document.createElement("p");
        const symbol = document.createElement("p");
        const quantityAmount = document.createElement("div");
        const quantity = document.createElement("p");
        const amount = document.createElement("p");
        const gainLossPercentage = document.createElement("span");
        const avgPrice = document.createElement("span");
        img.src = data[3];
        imgDiv.appendChild(img);
        imgDiv.classList.add("img-div");
        name.textContent = data[0];
        symbol.textContent = data[1];
        avgPrice.textContent = "Average price";
        nameSymbol.appendChild(name);
        nameSymbol.appendChild(symbol);
        nameSymbol.appendChild(avgPrice);
        nameSymbol.classList.add("name-symbol");
        astLogo.appendChild(imgDiv);
        astLogo.appendChild(nameSymbol);
        astLogo.classList.add("ast-logo");
        quantity.textContent = Number(data[4].toFixed(4));
        if (percentChange > 0) {
          amount.textContent = Number(data[5].toPrecision(6)).toLocaleString(
            "en-US",
            { style: "currency", currency: "USD" }
          );
        } else {
          amount.textContent = Number(0).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
        }

        gainLossPercentage.textContent = percentChange.toPrecision(4) + "%";
        percentChange >= 0
          ? (gainLossPercentage.style.color = "green")
          : (gainLossPercentage.style.color = "red");
        quantityAmount.appendChild(quantity);
        quantityAmount.appendChild(amount);
        quantityAmount.appendChild(gainLossPercentage);
        quantityAmount.classList.add("quan-amt");
        asset.appendChild(astLogo);
        asset.appendChild(quantityAmount);
        asset.classList.add("asset");
        container.appendChild(asset);
      }
      info.length < 4
        ? seeAllAsset.classList.toggle("show")
        : seeAllAsset.classList.toggle("show");
    } else {
      const seeAll = document.querySelector(".all-asset");
      seeAll.style.display = "none";
      const para = document.createElement("p");
      para.classList.add("empty");
      para.textContent = "you Dont have any asset";
      container.appendChild(para);
      container.classList.toggle("empty-container");
    }
  }
  function roundMarketCap(value) {
    console.log(value);
    if (value > 1e12) return (value / 1e12).toPrecision(2) + "T";
    if (value > 1e9) return (value / 1e9).toPrecision(3) + "B";
    if (value > 1e6) return (value / 1e6).toPrecision(3) + "M";
    if (value > 1e5) return (value / 1e5).toPrecision(3) + "K";
    if ((value = 1e4)) return value.toPrecision(1) + "K";
  }
});
