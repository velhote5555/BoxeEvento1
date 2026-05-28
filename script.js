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

let selected = odds[0];

const grid = document.getElementById("oddsGrid");
const stakeInput = document.getElementById("stake");
const selectedPick = document.getElementById("selectedPick");
const selectedMarket = document.getElementById("selectedMarket");
const selectedOdds = document.getElementById("selectedOdds");
const possibleReturn = document.getElementById("possibleReturn");
const possibleProfit = document.getElementById("possibleProfit");

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

function updateTicket() {
  const stake = Number(stakeInput.value) > 0 ? Number(stakeInput.value) : 0;
  const total = stake * selected.odds;
  const profit = Math.max(total - stake, 0);

  selectedPick.textContent = selected.pick;
  selectedMarket.textContent = selected.market;
  selectedOdds.textContent = `@ ${formatOdds(selected.odds)}`;
  possibleReturn.textContent = formatMoney(total);
  possibleProfit.textContent = formatMoney(profit);
}

function renderOdds() {
  grid.innerHTML = "";

  odds.forEach((odd, index) => {
    const card = document.createElement("button");
    card.type = "button";
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
      selected = odd;
      renderOdds();
      updateTicket();
    });

    grid.appendChild(card);
  });
}

stakeInput.addEventListener("input", updateTicket);

renderOdds();
updateTicket();
