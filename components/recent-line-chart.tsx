"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Dot, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Bitcoin_price_signal {
    Datetime: string; // ISO string format
    Price: number;
    Signal: number
  }
  
interface RecentLineChartComponentProps {
data: Bitcoin_price_signal[];
title: string;
}


export function RecentLineChart({ days = 7 }: { days?: number }) {
  // Filter data for the last `days` days
  const filteredData = chartData.filter((data) => {
    const today = new Date();
    const dataDate = new Date(data.Datetime);
    const diffInDays = (today.getTime() - dataDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= days;
  });

  // Get dot color based on the signal
  const getDotColor = (signal: string) => {
    switch (signal) {
      case "buy":
        return "#00C49F"; // Green for buy
      case "sell":
        return "#FF8042"; // Red for sell
      default:
        return "#8884d8"; // Default color for neutral
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price vs. Datetime</CardTitle>
        <CardDescription>Last {days} days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <LineChart
            data={filteredData}
            margin={{ top: 24, left: 24, right: 24, bottom: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Datetime"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              formatter={(value) => [`$${value}`, "Price"]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleString();
              }}
            />
            <Line
              type="monotone"
              dataKey="Price"
              stroke="#8884d8"
              strokeWidth={2}
              dot={({ payload, ...props }) => {
                return (
                  <Dot
                    {...props}
                    r={5}
                    fill={getDotColor(payload.Signal)} // Set dot color based on signal
                    stroke={getDotColor(payload.Signal)}
                  />
                );
              }}
            />
          </LineChart>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Showing buy/sell signals for the last {days} days
        </div>
      </CardFooter>
    </Card>
  );
}