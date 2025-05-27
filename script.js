let allCoins = [];

window.onload = () => {
  // Load all coins on startup
  fetch("https://api.coingecko.com/api/v3/coins/list")
    .then(res => res.json())
    .then(data => {
      allCoins = data;
    })
    .catch(err => console.error("Error loading coins list:", err));
};

function searchCoin() {
  const input = document.getElementById("coinInput").value.trim().toLowerCase();
  const errorDiv = document.getElementById("error");
  const table = document.getElementById("crypto-table");
  const tbody = table.querySelector("tbody");
  errorDiv.textContent = "";
  tbody.innerHTML = "";

  // Match only exact full name
  const coin = allCoins.find(c => c.name.toLowerCase() === input);

  if (!coin) {
    errorDiv.textContent = "Coin not found. Please enter exact full name.";
    table.style.display = "none";
    return;
  }

  fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin.id}`)
    .then(res => res.json())
    .then(data => {
      const coinData = data[0];
      if (!coinData) {
        errorDiv.textContent = "Unable to fetch data for this coin.";
        return;
      }

      const row = document.createElement("tr");
      row.innerHTML = `
        <td data-label="Coin">
          <img src="${coinData.image}" alt="${coinData.name}" width="20"> 
          ${coinData.name}
        </td>
        <td data-label="Price (INR)">₹${coinData.current_price}</td>
        <td data-label="24h Change" class="${coinData.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
          ${coinData.price_change_percentage_24h.toFixed(2)}%
        </td>
        <td data-label="Market Cap">₹${coinData.market_cap.toLocaleString()}</td>
      `;

      tbody.appendChild(row);
      table.style.display = "table";
    })
    .catch(err => {
      console.error("Error fetching coin data:", err);
      errorDiv.textContent = "An error occurred while fetching coin data.";
    });
}
