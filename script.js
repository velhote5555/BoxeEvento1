const odds = [
  { id: "afonso-win", market: "Resultado final", pick: 'Afonso "The Storm"', odds: 1.74, note: "favorito ligeiro" },
  { id: "pedro-win", market: "Resultado final", pick: 'Pedro "O Preciso"', odds: 2.12, note: "underdog perigoso" },
  { id: "draw", market: "Resultado final", pick: "Empate técnico", odds: 15, note: "cenário raro" },
  { id: "afonso-ko", market: "Método de vitória", pick: "Afonso por KO/TKO", odds: 2.85, note: "seleção" },
  { id: "pedro-ko", market: "Método de vitória", pick: "Pedro por KO/TKO", odds: 3.25, note: "seleção" },
  { id: "over-rounds", market: "Total de rounds", pick: "Mais de 7.5 rounds", odds: 1.88, note: "seleção" },
  { id: "under-rounds", market: "Total de rounds", pick: "Menos de 7.5 rounds", odds: 1.92, note: "seleção" },
  { id: "afonso-decision", market: "Método de vitória", pick: "Afonso por decisão", odds: 3.4, note: "seleção" },
  { id: "pedro-decision", market: "Método de vitória", pick: "Pedro por decisão", odds: 4.1, note: "seleção" },
];

const startingBalance = 100;
let balance = Number(localStorage.getItem("titasbetBalance")) || startingBalance;
let selected = odds[0];
let placedBet = JSON.parse(localStorage.getItem("titasbetPlacedBet") || "null");

const grid = document.getElementById("oddsGrid");
const stakeInput = document.getElementById("stake");
const selectedPick = document.getElementById("selectedPick");
const selectedMarket = document.getElementById("selectedMarket");
const selectedOdds = document.getElementById("selectedOdds");
const possibleReturn = document.getElementById("possibleReturn");
const possibleProfit = document.getElementById("possibleProfit");
const balanceEl = document.getElementById("balance");
const placeBetBtn = document.getElementById("placeBet");
const betStatus = document.getElementById("betStatus");
const ticket = document.querySelector(".ticket");

function formatOdds(value) {
  return Number(value).toFixed(2);
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function saveState() {
  localStorage.setItem("titasbetBalance", String(balance));
  localStorage.setItem("titasbetPlacedBet", JSON.stringify(placedBet));
}

function updateBalance() {
  balanceEl.textContent = formatMoney(balance);
}

function setStatus(message, type = "") {
  betStatus.textContent = message;
  betStatus.className = `status ${type}`;
}

function updateTicket() {
  const stake = Number(stakeInput.value) > 0 ? Number(stakeInput.value) : 0;
  const total = stake * selected.odds;
  const profit = Math.max(total - stake, 0);

  selectedPick.textContent = selected.pick;
  selectedMarket.textContent = selected.market;
  selectedOdds.textContent = `@ ${formatOdds(selected.odds)}`;
  possibleReturn.textContent = formatMoney(total);
  possibleProfit.textContent = formatMoney(profit);
  updateBalance();

  if (placedBet) {
    placeBetBtn.disabled = true;
    stakeInput.disabled = true;
    ticket.classList.add("bet-locked");
    setStatus(
      `✅ Aposta feita com sucesso! Apostaste ${formatMoney(placedBet.stake)} em ${placedBet.pick} @ ${formatOdds(placedBet.odds)}. Saldo descontado. Retorno possível: ${formatMoney(placedBet.return)}.`,
      "success"
    );
  } else {
    placeBetBtn.disabled = false;
    stakeInput.disabled = false;
    ticket.classList.remove("bet-locked");
    setStatus("Escolhe a odd, mete o montante e carrega em Apostar.");
  }
}

function renderOdds() {
  grid.innerHTML = "";

  odds.forEach((odd, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.disabled = Boolean(placedBet);
    card.className = `odd-card ${odd.id === selected.id ? "active" : ""}`;
    card.style.animationDelay = `${index * 55}ms`;

    card.innerHTML = `
      <span class="odd-market">${odd.market}</span>
      <span class="odd-pick">${odd.pick}</span>
      <span class="odd-bottom">
        <span class="odd-note">${odd.note}</span>
        <span class="odd-value">${formatOdds(odd.odds)}</span>
      </span>
    `;

    card.addEventListener("click", () => {
      if (placedBet) return;
      selected = odd;
      renderOdds();
      updateTicket();
    });

    grid.appendChild(card);
  });
}

function placeBet() {
  if (placedBet) {
    setStatus("Já fizeste uma aposta neste evento.", "error");
    return;
  }

  const stake = Number(stakeInput.value);

  if (!stake || stake <= 0) {
    setStatus("Mete um valor válido para apostar.", "error");
    return;
  }

  if (stake > balance) {
    setStatus("Saldo fake insuficiente.", "error");
    return;
  }

  const totalReturn = stake * selected.odds;

  balance -= stake;
  placedBet = {
    id: selected.id,
    market: selected.market,
    pick: selected.pick,
    odds: selected.odds,
    stake,
    return: totalReturn,
  };

  saveState();
  renderOdds();
  updateTicket();
}


stakeInput.addEventListener("input", updateTicket);
placeBetBtn.addEventListener("click", placeBet);

renderOdds();
updateTicket();
