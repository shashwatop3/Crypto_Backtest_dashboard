"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import LineChart from "@/components/line-chart";
import BarChartComponent from "@/components/bar-chart";
import { CumulativePortfolioChart } from "@/components/portfolio-chart";
import { DonutPieChart } from "@/components/donutPieChart";
import { SectionCards } from "@/components/sectionCard";
import { useGetBacktestData } from "@/hooks/use-get-backtest";
import { lastEntriesByDays } from "@/utils/cumulativePortfolio";
import { lastNdaysProfit } from "@/utils/lastNDaysProfit";
import { useBacktestState } from "@/hooks/use-backtest-state";
import { useEditBackTest } from "@/hooks/useOpenSheet";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns, Transaction } from "@/app/(dashboard)/columns";
import {RecentLineChart} from "@/components/recent-line-chart"


export default function Home() {
  const { state } = useBacktestState(); // Consume state from useBacktestState
  const { isOpen, onOpen } = useEditBackTest();

  // Fetch backtest data based on the current state
  const {
    data: backtestData,
    isLoading: isBacktestLoading,
    error: backtestError,
  } = useGetBacktestData(
    state.days,
    state.stop_loss,
    state.take_profit,
    state.initial_capital,
    state.Quantity
  );
  console.log("backtestData", backtestData);
  // Derived data using useMemo to optimize re-computation
  const capital_history = useMemo(() => {
    if (!backtestData?.dates) return [];
    return backtestData.dates
      .map((date: string, index: number) => {
        const capital = backtestData.capital_history[index];
        if (date && capital !== undefined) {
          return {
            Date: date,
            Capital: capital,
          };
        }
        return null;
      })
      .filter((entry: any): entry is PortfolioData => entry !== null);
  }, [backtestData]);

  const portfolio_data = useMemo(
    () => lastEntriesByDays(capital_history),
    [capital_history]
  );

  const price_history = useMemo(() => {
    if (!backtestData?.dates) return [];
    return backtestData.dates
      .map((date: string, index: number) => {
        const price = backtestData.prices[index];
        if (date && price !== undefined && !isNaN(new Date(date).getTime())) {
          return {
            Datetime: date,
            Price: price,
          };
        }
        return null;
      })
      .filter((entry: any): entry is Bitcoin_price => entry !== null);
  }, [backtestData]);

  const barChartData = useMemo(
    () => lastNdaysProfit(portfolio_data, 7),
    [portfolio_data]
  );

  const evals = backtestData?.evals || {};
  const winRate = Number(evals["Win Rate (%)"] ?? 0);
  const trades = Number(evals["Total Trades"] ?? 0);
  const profit = evals["Profit/Loss"] ?? "N/A";
  const returns = evals["Return (%)"] ?? "N/A";

  const transaction_data = useMemo(() => {
    if (!backtestData?.closed_positions) return [];
    return backtestData.closed_positions
      .slice()
      .reverse()
      .map((position: any) => {
        return {
          ...position,
        };
      });
  }, [backtestData]);

  const pieData = useMemo(
    () => [
      { name: "Profitable trades", value: winRate * 100 },
      { name: "Losing Trades", value: 100 - winRate * 100 },
    ],
    [winRate]
  );

  const sectCardData = useMemo(
    () => ({
      profit: profit,
      winRate: winRate,
      trades: trades,
      returns: returns,
      stploss: state.stop_loss, // Use updated state values
      takeprofit: state.take_profit, // Use updated state values
      intial_capital: state.initial_capital,
      Quantity: state.Quantity,
      current_capital: parseFloat(
        (capital_history[capital_history.length - 1]?.Capital || 0).toFixed(2)
      ),
      days: state.days,
    }),
    [
      profit,
      winRate,
      trades,
      returns,
      state.stop_loss,
      state.take_profit,
      state.initial_capital,
    ]
  );

  // Debugging logs
  // console.log("State in Home:", state);
  // console.log("Backtest Data:", backtestData);
  // console.log("Capital History:", capital_history);
  // console.log("Portfolio Data:", portfolio_data);
  // console.log("Price History:", price_history);

  if (isBacktestLoading) {
    return (
      <div className="bg-white h-full">
        <div className="grid grid-cols-12 gap-4 p-2">

          <div className="md:col-span-12 col-span-12">
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
  
          <div className="md:col-span-4 col-span-12">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
  
          <div className="md:col-span-8 col-span-12">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
  
          <div className="md:col-span-8 col-span-12">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
  
          <div className="md:col-span-4 col-span-12">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
  
          <div className="md:col-span-12 col-span-12">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (backtestError) return <p>Error loading data</p>;

  return (
    <>

      <div className="h-full">
        <div className="grid grid-cols-12 gap-4 p-2">
        <div className="md:col-span-12 col-span-12">
            <SectionCards {...sectCardData} />
          </div>
          <div className="md:col-span-4 col-span-12">
            <div className="shadow-md rounded-lg">
              <DonutPieChart data={pieData} trades={trades} title="Win Rate" />
            </div>
          </div>
          {/* <div className="md:col-span-3 col-span-12">
            <div className="shadow-md rounded-lg">
             <RecentLineChart />
            </div>
          </div> */}
          <div className="bg-white md:col-span-8 col-span-12 rounded-lg">
            <div className="shadow-md ">
              <LineChart data={price_history} title="Bitcoin Prices" />
            </div>
          </div>


          <div className="md:col-span-8 col-span-12">
            <div className="shadow-md rounded-lg">
              <CumulativePortfolioChart
                data={portfolio_data}
                title="Cumulative Portfolio Value"
              />
            </div>
          </div>

          <div className="md:col-span-4 col-span-12">
            <div className="shadow-md rounded-lg">
              <BarChartComponent title="Daily Profits" data={barChartData} />
            </div>
          </div>
        </div>
        <div className="bg-white container mx-auto py-2 shadow-md rounded-lg">
          <DataTable columns={columns} data={transaction_data} />
        </div>
        <p>This is an authenticated route</p>
      </div>
    </>
  );
}
