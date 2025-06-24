document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn");
  const tableBody = document.querySelector(".tbody");
  const hamburger = document.querySelector(".hamburger");
  const clsBtn = document.querySelector(".cls-menu");
  const menu = document.querySelector(".nav-bar");
  // hamburger.addEventListener("click", () => (menu.style.display = "flex"));
  // clsBtn.addEventListener("click", () => (menu.style.display = "none"));
  const login = document.querySelector(".login");
  const logout = document.querySelector(".logout");
  const portfolio = document.querySelector(".portfolio");
  const totalMarketCap = document.querySelector(".mkt-cap");
  const totalPercentChange = document.querySelector(".per-24h");
  const btcDominace = document.querySelector(".dominance");
  const moreInfo = document.querySelectorAll(".more-info >div");
  const searchBar = document.getElementById("search-bar");
  const marketList = document.querySelectorAll(".market-listing");
  const tableContent = document.getElementById("table");
  const warningCon = document.querySelector(".warning-container");
  const docBody = document.querySelector(".doc-body");
  const listAssetOverallInnerContainer = document.querySelector(".asset-con");
  const proceedNegoBtn = document.getElementById("proceedNego");
  const chat = document.querySelector(".chat");
  const unreadedMessagesTotalNo = document.querySelector(".no-of-unread-txt");
  const trade = document.querySelector(".trade");
  const marktCapDiv = document.querySelector(".markt-cap-div");
  const numbering = document.querySelector(".numbering");
  const numberingMktCapCont = document.querySelector(".numbering-mkt-cap-cont");
  const mainTableDiv = document.querySelector(".main-table-div");
  // const ip = "http://127.0.0.1:1998";
  const market = document.querySelector(".mkt-main-con");
  const mainAssetDiv = document.querySelector(".all-asset-div");
  const ip = "https://cryptomarket-server.onrender.com";

  fetchAssets();
  marketListing();
  function fetchAssets() {
    const auth = fetch(`${ip}/oauth/status`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const asset = fetch(`${ip}/assets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const total_value = fetch(`${ip}/total`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    Promise.all([auth, asset, total_value])
      .then(async (responses) => {
        for (let response of responses) {
          if (!response.ok) {
            throw new Error(`Error message:${response.status}`);
          }
        }
        const status = await responses[0].json();
        if (status.isloggedIn === "loggedIn") {
          portfolio.href = "portfolio/index.html";
          chat.href = "negotiations/index.html";
          trade.href = "transaction/index.html";
          const mssgNo = await unreadMessage();
          if (Number(mssgNo) > 0) {
            const nam = "hello";
            unreadedMessagesTotalNo.textContent = mssgNo;
          }
        } else {
          portfolio.href = "oauth/login/index.html";
          chat.href = "oauth/login/index.html";
          trade.href = "oauth/login/index.html";
        }

        const [assetsData, assetTotal] = [
          await responses[1].json(),
          await responses[2].json(),
        ];
        return [assetsData, assetTotal, status];
      })
      .then((data) => {
        console.log(data);
        updateTable(data[0]);
        data[0].map((obj) => {
          let values = Object.values(obj);
          for (val of values) {
            if (val === "bitcoin") {
              const btcMarketCap = obj.market_cap;
              calulateTotalMarketCap(data[1], btcMarketCap);
            }
          }
        });
      })
      .catch((error) => {
        console.error("fetch error", error);
      });
  }

  marketList.forEach((marketListBtn) => {
    marketListBtn.addEventListener("click", () => {
      // marketListing();
      mainAssetDiv.classList.toggle("hide");
    });
  });
  async function unreadMessage() {
    try {
      const url = await fetch(`${ip}/chat/unread-message`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const urlResult = await url.json();
      return urlResult;
    } catch (e) {
      console.error(e);
    }
  }
  function marketListing() {
    fetch(`${ip}/market-listing`, {
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
        displayMarketTable(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  function calulateTotalMarketCap(arr, btcCap) {
    totalMarketCap.textContent = roundMarketCap(arr[0]);
    totalPercentChange.textContent = roundMarketCap(arr[1]);
    btcDominace.textContent = (arr[0] / btcCap).toFixed(2) + "%";
  }
  // logout.addEventListener("click", () => {
  //   logOut();
  // });
  function logOut() {
    fetch(`${ip}/logout`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error message ${response.statusText}`);
        } else {
          window.location = `http://127.0.0.1:5500/frontend/dashboard.html`;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  let searchId = [];
  function updateTable(coins) {
    try {
      let incrementId = 1;
      for (const coin of coins) {
        if (coin.symbol) {
          const row = document.createElement("tr");
          row.classList.add("row");
          const id = document.createElement("div");
          const iconSymbol = document.createElement("div");
          const icon = document.createElement("img");
          const symbolMarketCap = document.createElement("div");
          const symbol = document.createElement("span");
          const marketCapNum = document.createElement("span");
          const price = document.createElement("td");
          const percentChange24h = document.createElement("td");
          const percentChange7d = document.createElement("td");
          const percentChange30d = document.createElement("td");
          const volumeChange24h = document.createElement("td");
          const volumeChange7d = document.createElement("td");
          const volumeChange30d = document.createElement("td");
          id.textContent = incrementId++;
          id.dataset.assetSymbol = coin.asset_id;
          row.dataset.assetSymbol = coin.asset_id;
          id.dataset.assetName = coin.asset_name;
          searchId.push(coin.asset_id);
          localStorage.setItem("searchId", searchId);

          // icon.src = coin.logo;
          symbol.textContent = coin.symbol.toUpperCase();
          marketCapNum.textContent = roundMarketCap(coin.market_cap).trim();
          percentChange24h.classList.add("percent-chng");
          percentChange24h.textContent =
            Number(coin.percent_change_24h.toFixed(3)) + "%".trim();
          if (coin.percent_change_24h < 0) {
            percentChange24h.style.color = "#ef4444";
          } else {
            percentChange24h.textContent =
              "+" + Number(coin.percent_change_24h.toFixed(3)) + "%".trim();
            percentChange24h.style.color = "#10b981";
          }
          symbolMarketCap.textContent = coin.symbolMarketCap;
          price.textContent = Number(
            coin.asset_price.toPrecision(7)
          ).toLocaleString("en-US", { style: "currency", currency: "USD" });
          if (coin.per7d < 0) {
            percentChange7d.textContent = coin.per7d ? coin.per7d : 0;
            percentChange7d.style.color = "#ef4444";
          } else {
            percentChange7d.textContent = coin.per7d ? coin.per7d : 0;
            percentChange7d.style.color = "#10b981";
          }
          if (coin.per30d < 0) {
            percentChange30d.textContent = coin.per30d ? coin.per30d : 0;
            percentChange30d.style.color = "#ef4444";
          } else {
            percentChange30d.textContent = coin.per30d ? coin.per30d : 0;
            percentChange30d.style.color = "#10b981";
          }
          if (coin.vol24h < 0) {
            volumeChange24h.textContent = coin.vol24h ? coin.vol24h : 0;
            volumeChange24h.style.color = "#ef4444";
          } else {
            volumeChange24h.textContent = coin.vol24h ? coin.vol24h : 0;
            volumeChange24h.style.color = "#10b981";
          }
          if (coin.vol7d < 0) {
            volumeChange7d.textContent = coin.vol7d ? coin.vol7d : 0;
            volumeChange7d.style.color = "#ef4444";
          } else {
            volumeChange7d.textContent = coin.vol7d ? coin.vol7d : 0;
            volumeChange7d.style.color = "#10b981";
          }
          if (coin.vol30d < 0) {
            volumeChange30d.textContent = coin.vol30d ? coin.vol30d : 0;
            volumeChange30d.style.color = "#ef4444";
          } else {
            volumeChange30d.textContent = coin.vol30d ? coin.vol30d : 0;
            volumeChange30d.style.color = "#10b981";
          }

          symbolMarketCap.appendChild(symbol);
          symbolMarketCap.classList.add("symbol-market-cap");
          symbolMarketCap.appendChild(marketCapNum);
          iconSymbol.appendChild(icon);
          iconSymbol.appendChild(symbolMarketCap);
          iconSymbol.classList.add("icon-symbol");
          numberingMktCapCont.appendChild(id);
          numberingMktCapCont.appendChild(iconSymbol);
          row.appendChild(price);
          row.appendChild(percentChange24h);
          row.appendChild(percentChange7d);
          row.appendChild(percentChange30d);
          row.appendChild(volumeChange24h);
          row.appendChild(volumeChange7d);
          row.appendChild(volumeChange30d);
          tableBody.appendChild(row);
          // return row;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  let gnt = localStorage.getItem("searchId");
  let turnArray = gnt.split(",");
  let deBouncer;
  searchBar.addEventListener("input", () => {
    clearTimeout(deBouncer);
    deBouncer = setTimeout(() => {
      searchAssets(searchBar.value);
    }, 3000);
  });

  function searchAssets(searchedAsset) {
    let pattern = new RegExp(searchedAsset, "i");
    let filteredAssets = new Array(
      ...new Set(
        turnArray.filter((asset) => {
          return pattern.test(asset.toLowerCase());
        })
      )
    );
    let url;
    if (filteredAssets && searchedAsset.length > 1) {
      url = `${ip}/search?searched_asset=${filteredAssets}`;
    } else {
      url = `${ip}/assets`;
      console.log("normal asset");
      console.log(filteredAssets);
    }
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`failed:${response.statusText}`);
        } else {
          return response.json();
        }
      })
      .then((data) => {
        // let children = Array.from(numberingMktCapCont.children);
        console.log(numberingMktCapCont.children.length);

        while (tableBody.firstChild) {
          tableBody.removeChild(tableBody.firstChild);
        }
        while (numberingMktCapCont.children.length > 2) {
          let remove = numberingMktCapCont.lastElementChild;
          numberingMktCapCont.removeChild(remove);
        }
        updateTable(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  moreInfo.forEach((div) => {
    const innerNoodelist = div.querySelectorAll("div >*");
    let array = Array.from(innerNoodelist);
    array[0].addEventListener("click", () => {
      array[1].classList.toggle("hide");
    });
  });

  //add eventlistener to row to view asset details
  const observer = new MutationObserver(() => {
    const rows = document.querySelectorAll(".tbody .row");
    rows.forEach((row) => {
      row.setAttribute(
        "onclick",
        `window.location='details/index.html?symbol=${row.dataset.assetSymbol}'`
      );
    });
  });
  observer.observe(tableBody, { childList: true, subtree: true });

  function displayMarketTable(listed) {
    while (market.children > 4) {
      market.removeChild(mainTableDiv.lastElementChild);
    }
    let no = 1;
    listed.map((list) => {
      const miniCon = document.createElement("div");
      miniCon.classList.add("mini-con");
      const numbering = document.createElement("div");
      const assetDiv = document.createElement("div");
      assetDiv.classList.add("mkt-asset-con");
      const purchasing = document.createElement("div");
      purchasing.classList.add("buy-nego", "hide");
      const quickBuy = document.createElement("div");
      quickBuy.classList.add("quick-buy");
      const negotiate = document.createElement("div");
      negotiate.classList.add("nego");
      const seller = document.createElement("div");
      const asset = document.createElement("div");
      const img = document.createElement("img");
      const assetSymbolDiv = document.createElement("div");
      const quantity = document.createElement("div");
      const price = document.createElement("div");
      numbering.textContent = no++;
      img.src = list[4];
      assetSymbolDiv.appendChild(img);
      assetSymbolDiv.appendChild(asset);
      seller.textContent = list[0];
      asset.textContent = list[2].toUpperCase();
      quantity.textContent = list[6];
      price.textContent = list[5];
      quickBuy.textContent = "FAST BUY";
      negotiate.textContent = "NEGOTIATE";
      purchasing.appendChild(quickBuy);
      purchasing.appendChild(negotiate);
      assetDiv.appendChild(numbering);
      assetDiv.appendChild(seller);
      assetDiv.appendChild(asset);
      assetDiv.appendChild(quantity);
      assetDiv.appendChild(price);
      miniCon.appendChild(assetDiv);
      miniCon.appendChild(purchasing);

      market.appendChild(miniCon);
      miniCon.addEventListener("click", () => {
        purchasing.classList.toggle("hide");
      });
      boughtAsset = {
        asset_id: list[3],
        sellerId: Number(list[7]),
      };
      quickBuy.addEventListener("click", () => {
        purchaseListedAsset(boughtAsset);
      });
      negotiate.addEventListener("click", () => {
        warningCon.classList.toggle("hide");
        docBody.style.overflow = "hidden";
      });
      proceedNegoBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        console.log("click");
        boughtAsset.status = "Negotiating";
        let chatId = await markAssetToNegotiation(boughtAsset);
        console.log(chatId);
        let assetDetails = new URLSearchParams(chatId);
        console.log(assetDetails);
        window.location = `negotiations/chat/index.html?${assetDetails}`;
      });
    });
    async function markAssetToNegotiation(data) {
      try {
        const sendStatus = await fetch(`${ip}/market-listing`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const negotiationStatus = await sendStatus.json();
        return negotiationStatus;
      } catch (err) {
        console.error("Error:", err);
      }
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
      } catch (error) {
        console.error(error);
      }
    }
  }

  function roundMarketCap(value) {
    if (value > 1e12) return (value / 1e12).toPrecision(2) + "T";
    if (value > 1e9) return (value / 1e9).toPrecision(3) + "B";
    if (value > 1e6) return (value / 1e6).toPrecision(3) + "M";
    if (value > 1e5) return (value / 1e5).toPrecision(3) + "K";
    if ((value = 1e4)) return value / 1000 + "K";
  }
});
