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
  const profile = document.querySelector(".user-profile");
  const totalMarketCap = document.querySelector(".mkt-cap");
  const totalPercentChange = document.querySelector(".per-24h");
  const btcDominace = document.querySelector(".dominance");
  const moreInfo = document.querySelectorAll(".more-info >div");
  const searchBar = document.getElementById("search-bar");
  console.log(moreInfo);
  // const ip = "http://127.0.0.1:1998";
  const ip = "https://cryptomarket-server.onrender.com";

  fetchAssets();
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
          } else {
            const status = await responses[0].json();
            if (status.isloggedIn === "loggedIn") {
              // logout.classList.toggle("toggle_login_logout");
              // login.classList.toggle("toggle_login_logout");
            } else {
              // login.classList.toggle("toggle-login-logout");
              // logout.classList.toggle("toggle-login-logout");
            }
            profile.addEventListener("click", () => {
              if (status.isloggedIn === "loggedIn") {
                window.location = "profile/index.html";
              } else {
                window.location = "oauth/login/index.html";
              }
            });
            return [await responses[1].json(), await responses[2].json()];
          }
        }
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
          const id = document.createElement("td");
          const marketCap = document.createElement("td");
          const iconSymbol = document.createElement("div");
          const icon = document.createElement("img");
          const symbolMarketCap = document.createElement("div");
          const symbol = document.createElement("span");
          const marketCapNum = document.createElement("span");
          const price = document.createElement("td");
          const percentChange24h = document.createElement("td");
          id.textContent = incrementId++;
          id.dataset.assetSymbol = coin.asset_id;
          id.dataset.assetName = coin.asset_name;
          searchId.push(coin.asset_id);
          localStorage.setItem("searchId", searchId);

          icon.src = coin.logo;
          symbol.textContent = coin.symbol.toUpperCase();
          marketCapNum.textContent = roundMarketCap(coin.market_cap).trim();
          percentChange24h.textContent =
            Number(coin.percent_change_24h.toFixed(3)) + "%".trim();
          if (coin.percent_change_24h < 0) {
            percentChange24h.style.backgroundColor = "#ef4444";
          } else {
            percentChange24h.textContent =
              "+" + Number(coin.percent_change_24h.toFixed(3)) + "%".trim();
            percentChange24h.style.backgroundColor = "#10b981";
          }
          symbolMarketCap.textContent = coin.symbolMarketCap;
          price.textContent = Number(
            coin.asset_price.toPrecision(7)
          ).toLocaleString("en-US", { style: "currency", currency: "USD" });
          symbolMarketCap.appendChild(symbol);
          symbolMarketCap.classList.add("symbol-market-cap");
          symbolMarketCap.appendChild(marketCapNum);
          iconSymbol.appendChild(icon);
          iconSymbol.appendChild(symbolMarketCap);
          iconSymbol.classList.add("icon-symbol");
          marketCap.appendChild(iconSymbol);
          row.appendChild(id);
          row.appendChild(marketCap);
          row.appendChild(price);
          row.appendChild(percentChange24h);
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
  console.log(searchBar.value.length);
  searchBar.addEventListener("input", () => {
    clearTimeout(deBouncer);
    deBouncer = setTimeout(() => {
      searchAssets(searchBar.value);
    }, 3000);
  });

  function searchAssets(searchedAsset) {
    console.log(searchedAsset);
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
        while (tableBody.firstChild) {
          tableBody.removeChild(tableBody.firstChild);
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
      const tds = row.querySelectorAll("td");
      let symbol = tds[0].dataset.assetSymbol;
      row.setAttribute(
        "onclick",
        `window.location='details/index.html?symbol=${symbol}'`
      );
    });
  });
  observer.observe(tableBody, { childList: true, subtree: true });
  function roundMarketCap(value) {
    if (value > 1e12) return (value / 1e12).toPrecision(2) + "T";
    if (value > 1e9) return (value / 1e9).toPrecision(3) + "B";
    if (value > 1e6) return (value / 1e6).toPrecision(3) + "M";
    if (value > 1e5) return (value / 1e5).toPrecision(3) + "K";
    if ((value = 1e4)) return value / 1000 + "K";
  }
});
