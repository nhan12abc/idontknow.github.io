const API_BASE = "http://127.0.0.1:5000";

// Chart object
let chart = null;
let candleSeries = null;

let currentSymbol = "EURUSD";
let currentTF = "M15";

// ========================
// Load symbol list
// ========================
async function loadSymbols() {
    let res = await fetch(`${API_BASE}/api/all_signals`);
    let data = await res.json();

    const list = document.getElementById("symbol-list");
    list.innerHTML = "";

    for (let symbol of Object.keys(data)) {
        let item = document.createElement("li");
        let final = data[symbol].final.direction;

        item.classList.add(
            final === "BUY" ? "symbol-buy" :
            final === "SELL" ? "symbol-sell" :
            "symbol-none"
        );

        item.innerText = `${symbol} → ${final}`;
        item.onclick = () => {
            currentSymbol = symbol;
            updateSymbolDisplay();
        };

        list.appendChild(item);
    }
}

// ========================
// Load chart candles
// ========================
async function loadChart() {
    let res = await fetch(`${API_BASE}/api/candles?symbol=${currentSymbol}&timeframe=${currentTF}`);
    let data = await res.json();

    if (!chart) {
        chart = LightweightCharts.createChart(document.getElementById("chart"), {
            layout: { textColor: "white", background: { type: 'solid', color: "#10131a" }},
            grid: { vertLines: { color: "#333"}, horzLines: { color: "#333" } },
        });

        candleSeries = chart.addCandlestickSeries();
    }

    candleSeries.setData(data);
}

// ========================
// Load analysis summary
// ========================
async function loadAnalysis() {
    let res = await fetch(`${API_BASE}/api/single?symbol=${currentSymbol}`);
    let analysis = await res.json();

    document.getElementById("analysis-box").innerText =
        JSON.stringify(analysis, null, 2);
}

// Update everything
async function updateSymbolDisplay() {
    await loadChart();
    await loadAnalysis();
}

// ========================
// Timeframe selection
// ========================
document.querySelectorAll(".tf-btn").forEach(btn => {
    btn.onclick = () => {
        currentTF = btn.dataset.tf;
        loadChart();
    };
});

// Auto-refresh symbol list every 5 sec
setInterval(loadSymbols, 5000);

loadSymbols();
loadChart();
loadAnalysis();
