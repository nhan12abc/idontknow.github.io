# web/app.py
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import MetaTrader5 as mt5

from config.settings import DEFAULT_SYMBOL, DEFAULT_TIMEFRAME
from core.signal_checker import SignalChecker

app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates",
)
CORS(app)


@app.route("/")
def index():
    # Trả về giao diện dashboard
    return render_template("dashboard.html")


# --------- API SYMBOLS (giữ lại / sửa theo backend của bạn) ---------
# 6 cặp cố định như bạn yêu cầu
SYMBOLS = ["EURUSDm", "USDJPYm", "GBPUSDm", "USDCADm", "AUDUSDm", "USDCHFm"]


@app.route("/api/symbols")
def api_symbols():
    return jsonify(SYMBOLS)


@app.route("/api/scan")
def api_scan():
    symbol = request.args.get("symbol", DEFAULT_SYMBOL)
    timeframe = request.args.get("timeframe", DEFAULT_TIMEFRAME)

    sc = SignalChecker(symbol=symbol, timeframe=timeframe)
    out = sc.scan_once()   # hoặc hàm scan của bạn, miễn là trả về dict

    return jsonify(out)


# Nếu bạn đã có API khác (/api/scan_all, /api/candles, ...) thì để nguyên bên dưới
# ...


if __name__ == "__main__":
    app.run(debug=True)
