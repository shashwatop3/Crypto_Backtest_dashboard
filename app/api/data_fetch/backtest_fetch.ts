import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useGetBacktestData = (
    days: number,
    stop_loss: number,
    take_profit: number,
    intial_capital: number,
    Quantity: number,
) => {
    const options = {
        method: 'GET',
        url: 'http://localhost:8000/recent_backtest',
        params:{
            days:days,
            stop_loss:stop_loss,
            take_profit:take_profit,
            intial_capital:intial_capital,
            Quantity:Quantity
        }
    }
    return useQuery({
        queryKey: ["backtestData", days, stop_loss, take_profit, intial_capital, Quantity],
        queryFn: async () => {
            try {
                const res = await axios(options);
                return res.data;
            } catch (error: any) {
                throw new Error(error.response?.data?.message || "An error occurred");
            }
        },
        staleTime: 1000 * 60 * 15, // 15 minutes cache // Refetch every 15 minutes
    });

}
