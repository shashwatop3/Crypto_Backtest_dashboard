import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";

// Define TypeScript interfaces
interface BarChartData {
  Date: string;
  Profit: number;
}

interface BarChartComponentProps {
  title: string;
  data: BarChartData[];
}

// Sample data
// const chartData: BarChartData[] = [
//   { month: "January", revenue: 12500, expenses: 8400 },
//   { month: "February", revenue: 14000, expenses: 9200 },
//   { month: "March", revenue: 15800, expenses: 7600 },
//   { month: "April", revenue: 16200, expenses: 10100 },
//   { month: "May", revenue: 18100, expenses: 11200 },
//   { month: "June", revenue: 17400, expenses: 9800 },
// ];

// Chart configuration
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function BarChartComponent({ title, data }: BarChartComponentProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis 
              dataKey="Date" 
              tickLine={false} 
              tickMargin={10} 
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} 
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={['dataMin - 500', 'dataMax + 500']}
            />
            <ChartTooltip 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              content={<ChartTooltipContent />} 
            />
            <ChartLegend iconType="circle" iconSize={8} />
            <Bar 
              dataKey="Profit" 
              fill="var(--chart-1)" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
