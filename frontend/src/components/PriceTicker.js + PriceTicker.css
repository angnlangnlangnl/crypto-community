import React, { useState, useEffect } from 'react';
import './PriceTicker.css';

function PriceTicker() {
  const [prices, setPrices] = useState([
    { symbol: 'BTC', price: 43250.50, change: 2.35 },
    { symbol: 'ETH', price: 2250.75, change: 1.85 },
    { symbol: 'BNB', price: 305.20, change: -0.45 },
    { symbol: 'SOL', price: 98.60, change: 5.20 },
    { symbol: 'ADA', price: 0.58, change: -1.25 }
  ]);

  return (
    <div className="price-ticker">
      <div className="ticker-scroll">
        {prices.map((item, index) => (
          <div key={index} className="ticker-item">
            <span className="symbol">{item.symbol}</span>
            <span className="price">${item.price.toLocaleString()}</span>
            <span className={`change ${item.change >= 0 ? 'positive' : 'negative'}`}>
              {item.change >= 0 ? '+' : ''}{item.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PriceTicker;
