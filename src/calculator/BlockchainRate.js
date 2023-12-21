async function fetchBitcoinPrices() {
    try {
        const response = await fetch("https://blockchain.info/ticker");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const usdPrice = data["USD"];
        const rubPrice = data["RUB"];

        return {
            USD: usdPrice,
            RUB: rubPrice
        };
    } catch (error) {
        console.error('Error fetching Bitcoin prices:', error);
        return {};
    }
}

// Использование функции
/*fetchBitcoinPrices().then(prices => {
    console.log(prices.RUB.last);
});*/

module.exports = fetchBitcoinPrices;