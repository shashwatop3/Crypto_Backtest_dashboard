import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetBacktestData = (
  days: number,
  stop_loss: number,
  take_profit: number,
  initial_capital: number,
  Quantity: number
) => {
  const options = {
    method: "GET",
    url: process.env.NEXT_PUBLIC_BACKTEST_API_URL || "http://localhost:8000/recent_backtest",
    params: {
      days,
      stop_loss,
      take_profit,
      initial_capital,
      Quantity,
    },
  };

  return useQuery({
    queryKey: ["backtestData", days, stop_loss, take_profit, initial_capital, Quantity],
    queryFn: async () => {
      const res = await axios(options);
      return res.data;
    },
    staleTime: 1000 * 60 * 15, // Cache data for 15 minutes
    enabled: days > 0 && stop_loss > 0 && take_profit > 0 && initial_capital > 0 && Quantity > 0,
  });
};