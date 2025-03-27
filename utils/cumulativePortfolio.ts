interface PortfolioData {
    Date: string; // ISO string format
    Capital: number;
}

export const lastEntriesByDays = (data: PortfolioData[]) => {
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("Invalid or empty data passed to lastEntriesByDays:", data);
        return [];
    }


    const lastEntriesByDay = Object.values(
        data.reduce((acc, point) => {
            const dateOnly = point.Date.split('T')[0]; // Extract the date part (YYYY-MM-DD)
            if (!acc[dateOnly] || new Date(point.Date) > new Date(acc[dateOnly].Date)) {
                acc[dateOnly] = point; // Keep the latest entry for the day
            }
            return acc;
        }, {} as Record<string, PortfolioData>)
    );

    return lastEntriesByDay;
};