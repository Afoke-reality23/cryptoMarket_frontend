const urlParams = new URLSearchParams(window.location.search);
const asset_id = urlParams.get("symbol");
const purchase = document.querySelector("#purchase");
const astImg = document.querySelector(".ast-img");
const astName = document.querySelector(".ast-name");
const astSymbol = document.querySelector(".ast-symbol");
const price = document.querySelector(".price");
const priceChng = document.querySelector(".price-change");
const pricePara = document.querySelector(".price-para");
const mkt = document.querySelector(".mkt");
const spm = document.querySelector(".spm");
const spi = document.querySelector(".spi");
const sum = document.querySelector(".sum");
const founder = document.querySelector(".founder");
const url = document.querySelector(".url");
const tsp = document.querySelector(".tsp");
const csp = document.querySelector(".csp");
const btc = document.querySelector(".btc");
const about = document.querySelector(".about");
const faqbody = document.querySelector(".faq-parent-container");
const newsContainer = document.querySelector(".news-container");
const cardContainer = document.querySelector(".card-container");
const rate = document.querySelector(".rate");
const rateSymbol = document.querySelector(".rate-symbol");
const purchaseContainer = document.querySelector(".purchase-container");
const buy = document.querySelector("#buy");
const amount = document.getElementById("amount");
const quantity = document.querySelector("#quantity");
const amtError = document.querySelector(".amt-error");
const purchaseBtn = document.getElementById("purchase-btn");
const cancel = document.getElementById("cancel");
const aboutPara = document.querySelector(".about-para");

let normalPrice;
// const ip = "http://127.0.0.1:1998";
const ip = "https://cryptomarket-server.onrender.com";
function fetchAssetDetail(assetId) {
  if (assetId) {
    const auth = fetch(`${ip}/oauth/status`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const details = fetch(`${ip}/asset_details?asset_id=${asset_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    Promise.all([auth, details])
      .then(async ([auth, detail]) => {
        console.log(auth);
        if (!(auth.ok & detail.ok)) {
          throw new Error(`Error message:failed to fetch`);
        } else {
          let status = await auth.json();
          buy.addEventListener("click", () => {
            if (status.isloggedIn === "loggedIn") {
              purchaseContainer.style.display = "flex";
            } else {
              window.location = "../oauth/login/index.html";
            }
          });
          // getLoginStatus(/)
          return detail.json();
        }
      })
      .then((data) => {
        console.log(data);
        // getCharts(data);
        populateDetailPage(data);
        fetchNews(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

amount.addEventListener("input", () => {
  if (amount.value <= 0) {
    amtError.textContent = "pls enter a valid price";
    amtError.style.display = "block";
  } else {
    quantity.value = (Number(amount.value) / normalPrice).toPrecision(3);
    console.log(amount.value);
    amtError.style.display = "none";
  }
});
function processPurchase() {
  setTimeout(() => {
    fetch(`${ip}/buy`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trans_price: Number(amount.value),
        trans_quantity: Number(quantity.value),
        // coinPrice: normalPrice,,
        asset_id: asset_id,
      }),
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
        // const assetAmount = Number(data.quantity.toPrecision(3));
        // console.log(assetAmount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, 300);
}
purchaseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("inside purchase");
  processPurchase();
});
cancel.addEventListener("click", () => {
  purchaseContainer.style.display = "none";
});
function getCharts(data) {
  try {
    fetch(`${ip}/chart?id=${data.id}`, {
      method: "GET",
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Eroor("fail to fetch chart data");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        displayCharts(data);
        console.log("display called");
      });
  } catch (error) {
    console.error(error);
  }
}
function displayCharts(data) {
  try {
    const chartsValue = [];
    for (let value of data) {
      const time = new Date(value.pop() * 1000).toLocaleString();
      const open = value.shift();
      chartsValue.unshift([time, open]);
    }
    let option = {
      chart: {
        type: "area",
        height: 250,
        width: "100%",
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      series: [
        {
          name: "crypto",
          data: chartsValue,
        },
      ],
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: "Asset Price Movement",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 1,
          gradientToColors: ["#ff0000"],
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stop: [0, 90, 100],
        },
        colors: ["#28a745"],
      },
      grid: {
        show: false,
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val / 1000).toFixed(2);
          },
        },
        title: {
          text: "Price",
        },
      },
      tooltip: {
        shared: false,
        enabled: true,
        style: {
          fontSize: "14px",
          fontFamily: "Arial",
          color: "grey",
        },
        theme: "dark",
        y: {
          formatter: function (val) {
            return `${val}`;
          },
        },
      },
    };
    let chart = new ApexCharts(document.querySelector(".chart-board"), option);
    chart.render();
  } catch (error) {
    console.error(error);
  }
}

function populateDetailPage(data) {
  normalPrice = data.asset_price;
  astImg.src = data.logo;
  astName.textContent = data.asset_name;
  astSymbol.textContent = `(${data.symbol})`.toUpperCase();
  price.textContent = Number(data.asset_price.toPrecision(7)).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  );
  rate.textContent = price.textContent;
  rateSymbol.textContent = astSymbol.textContent;
  priceChng.textContent = Number(data.percent_chng_24h).toPrecision(3);
  if (data.percent_chng_24h < 0) {
    priceChng.style.color = "red";
  } else {
    priceChng.style.color = "green";
  }
  pricePara.textContent = `${astName.textContent} price chart ${astSymbol.textContent}`;
  mkt.textContent = roundMarketCap(data.market_cap);
  spm.textContent = roundMarketCap(data.supply_max);
  spi.textContent = roundMarketCap(data.supply_issued);
  url.href = data.link;
  url.textContent = data.link;
  founder.textContent = data.founder;
  sum.textContent = data.snippet;
  tsp.textContent = roundMarketCap(data.total_supply);
  csp.textContent = roundMarketCap(data.circulating_supply);
  btc.textContent = data.asset_price;
  about.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.9)),url(${data.logo})`;
  about.style.backgroundSize = "cover";
  const values = data.description.split("##").slice(1);
  let faq = {};
  values.map((v) => {
    let faqItems = v.split(/[\r\n]+/);
    let faqKeys = faqItems[0];
    let faqValues = faqItems[1].trimStart();
    faq[faqKeys] = faqValues;
    const paraQuestion = document.createElement("p");
    const paraAnswer = document.createElement("p");
    paraQuestion.textContent = faqKeys.replace("?", "");
    paraAnswer.textContent = faqValues;
  });

  for (let key in faq) {
    const faqContainer = document.createElement("div");
    faqContainer.classList.add("faq-container");
    const questions = document.createElement("p");
    questions.classList.add("questions");
    const answers = document.createElement("p");
    answers.classList.add("answers");
    questions.addEventListener("click", () => {
      toggleFaqAnswers(answers, faqContainer);
    });
    aboutPara.textContent = data.summary;
    questions.textContent = key;
    answers.textContent = faq[key];
    faqContainer.appendChild(questions);
    faqContainer.appendChild(answers);
    faqbody.appendChild(faqContainer);
  }
}

function toggleFaqAnswers(answers, container) {
  answers.classList.toggle("answers");
  container.classList.toggle("trans-faq");
}

function fetchNews(data) {
  const asset = data.symbol;
  const url = `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=${asset}&limit=10`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("failed to fetch asset news");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      // console.log(data);
      displayNews(data.Data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function displayNews(newsItem, pageStart = 0, pageEnd = 10) {
  let newsPage = newsItem.slice(pageStart, pageEnd);
  newsPage.forEach((news) => {
    const publised = String(new Date(news.published_on * 1000)).slice(0, 15);
    const cards = document.createElement("div");
    cards.classList.add("card");
    const img = document.createElement("img");
    img.src = news.imageurl;
    const cardContent = document.createElement("div");
    cardContent.classList.add("content");
    const cat = document.createElement("p");
    cat.textContent = news.categories;
    const title = document.createElement("p");
    title.classList.add("title");
    title.textContent = news.title;
    const newsBody = document.createElement("div");
    newsBody.classList.add("body");
    newsBody.textContent = news.body;
    const sourceDate = document.createElement("div");
    sourceDate.classList.add("source-date");
    const source = document.createElement("span");
    source.textContent = news.source;
    const date = document.createElement("span");
    date.textContent = publised;
    const readMore = document.createElement("div");
    const link = document.createElement("a");
    link.href = news.url;
    link.textContent = "Read More";
    sourceDate.appendChild(date);
    cardContent.appendChild(cat);
    cardContent.appendChild(title);
    cardContent.appendChild(newsBody);
    cardContent.appendChild(newsBody);
    sourceDate.appendChild(source);
    sourceDate.appendChild(date);
    cardContent.appendChild(sourceDate);
    cardContent.appendChild(readMore);
    readMore.appendChild(link);
    cards.appendChild(img);
    cards.appendChild(cardContent);
    cardContainer.appendChild(cards);
  });
  let pages = document.querySelector(".pages");
  if (!pages) {
    pages = document.createElement("div");
    const laq = document.createElement("button");
    // laq.innerText = "-";
    laq.dataset.type = "prev";
    laq.innerHTML = "&laquo;";

    pages.appendChild(laq);
    pages.classList.add("pages");
    const pagination = newsItem.length / 10;
    for (let i = 0; i < pagination; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.value = i;
      pageBtn.innerText = `${i + 1}`;
      pages.appendChild(pageBtn);
    }
    const raq = document.createElement("button");
    // raq.innerText = "+";
    raq.dataset.type = "next";
    raq.innerHTML = "&raquo;";
    pages.appendChild(raq);
    newsContainer.appendChild(pages);
  }
  const pageButtons = pages.querySelectorAll(`button`);
  pageButtons.forEach((page, index) => {
    page.addEventListener("click", () => {
      while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
      }
      if (page.dataset.type === "prev") {
        const laqEnd = pageEnd > 10 ? (pageEnd / 10 - 1) * 10 : 10;
        const laqStart = laqEnd - 10;
        displayNews(newsItem, laqStart, laqEnd);
      } else if (page.dataset.type === "next") {
        const raqEnd = pageEnd < 50 ? (pageEnd / 10 + 1) * 10 : 50;
        const raqStart = raqEnd - 10;
        displayNews(newsItem, raqStart, raqEnd);
      } else {
        const end = index * 10;
        const start = end - 10;
        displayNews(newsItem, start, end);
      }
    });
  });
}
function roundMarketCap(value) {
  if (value > 1e12) return (value / 1e12).toPrecision(2) + "T";
  if (value > 1e9) return (value / 1e9).toPrecision(3) + "B";
  if (value > 1e6) return (value / 1e6).toPrecision(3) + "M";
  if (value > 1e5) return (value / 1e5).toPrecision(3) + "K";
  if ((value = 1e4)) return value.toPrecision(1) + "K";
}
fetchAssetDetail(asset_id);
