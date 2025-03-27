import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface Bitcoin_price {
  Datetime: string; // ISO string format
  Price: number;
}

interface LineChartComponentProps {
  data: Bitcoin_price[];
  title: string;
}

export default function LineChartComponent({
  data,
  title,
}: LineChartComponentProps) {
  return (
    <div className="w-full h-[400px] p-4">
      <h2 className="text-center text-lg font-medium mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="Datetime"
            tickFormatter={(timestamp) => {
              try {
                const date = new Date(timestamp);
                if (isNaN(date.getTime())) throw new Error("Invalid date");
                return format(date, "MMM dd, yyyy HH:mm");
              } catch {
                return "Invalid Date"; // Fallback for invalid dates
              }
            }}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            domain={["auto", "auto"]} // Automatically adjusts to the exact data range
            tickCount={8}
            tickFormatter={(value) => `$${value.toLocaleString()}`} // Format Y-axis ticks to display price
          />
          <Tooltip
            formatter={(value) => [`$${value}`, "Price"]}
            labelFormatter={(label) => {
              const date =
                typeof label === "number" ? new Date(label) : new Date(label);
              return format(date, "MMM dd, yyyy HH:mm");
            }}
          />
          <Line
            type="monotone"
            dataKey="Price"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false }
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
