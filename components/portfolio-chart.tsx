"use client";

import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface PortfolioData {
  Date: string; // ISO string format
  Capital: number;
}

interface CumulativePortfolioChartProps {
  data: PortfolioData[];
  title?: string;
}

export function CumulativePortfolioChart({
  data,
  title = "Cumulative Net Portfolio Value",
}: CumulativePortfolioChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
      <div className="h-[268px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="Date" // Updated to match the `PortfolioData` interface
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "Date", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              dataKey="Capital" // Updated to match the `PortfolioData` interface
              tickFormatter={(capital) => `$${capital.toLocaleString()}`}
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "Capital", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-sm">
                      <p className="text-sm">
                        {new Date(payload[0].payload.Date).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-bold">
                        ${payload[0].payload.Capital.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="Capital" // Updated to match the `PortfolioData` interface
              stroke="hsl(var(--primary))"
              fill="#7fb2fa"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center">
          <div
            className="w-3 h-3 mr-1"
            style={{
              backgroundColor: "hsl(var(--primary))",
              opacity: 0.2,
            }}
          ></div>
          <div
            className="w-3 h-3 mr-1 -ml-2"
            style={{
              border: "2px solid hsl(var(--primary))",
              backgroundColor: "transparent",
            }}
          ></div>
          <span className="text-sm">Net Portfolio Value</span>
        </div>
      </div>
    </Card>
  );
}