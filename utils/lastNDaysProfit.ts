interface PortfolioData {
    Date: string; // ISO string format
    Capital: number;
}

export const lastNdaysProfit = (data: PortfolioData[], n: number) => {
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("Invalid or empty data passed to lastNdaysProfit:", data);
        return [];
    }

    const required = data.slice(-n-1);
    const lastNdaysProfit = required.map((point, index) => {
        if (index === 0) {
            return {
                Date: point.Date,
                Profit: 0
            }
        } else {
            return {
                Date: point.Date,
                Profit: point.Capital - required[index - 1].Capital
            }
        }
    });

    return lastNdaysProfit;
}