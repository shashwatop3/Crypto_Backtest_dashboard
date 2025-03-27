"use client";

import { Card } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  ComposedChart,
  ReferenceArea,
} from "recharts";
import { format } from "date-fns"; // Import format function
import { min } from "drizzle-orm";

// Updated interface to include date
interface DataPoint {
  index: number;
  price: number;
  regime: 0 | 1;
  date: string | number; // Date can be string or timestamp
}

interface BitcoinRegimeChartProps {
  data: DataPoint[];
  title?: string;
  maxYValue?: number;
  minYValue?: number;
}

export function BitcoinRegimeChart({ 
  data, 
  title = "Bitcoin Price with Smoothed Market Regimes",
  maxYValue = 90000,
  minYValue = 80000
}: BitcoinRegimeChartProps) {
  // Find regime transition points
  const regimeTransitions: { start: string | number; end: string | number; regime: 0 | 1 }[] = [];
  let currentRegime = data[0]?.regime;
  let startDate = data[0]?.date;
  
  data.forEach((point, i) => {
    if (point.regime !== currentRegime || i === data.length - 1) {
      // Capture this transition
      regimeTransitions.push({
        start: startDate,
        end: point.date,
        regime: currentRegime
      });
      
      // Start tracking the new regime
      startDate = point.date;
      currentRegime = point.regime;
    }
  });
  
  // Add the final segment if needed
  if (data.length > 0 && startDate !== data[data.length - 1].date) {
    regimeTransitions.push({
      start: startDate,
      end: data[data.length - 1].date,
      regime: currentRegime
    });
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4 text-center">{title}</h3>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            
            {/* Updated X-Axis to use date instead of index */}
            <XAxis
              dataKey="date"
              tickFormatter={(timestamp) => {
                const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
                return format(date, "HH:mm");
              }}
              interval="preserveStartEnd" 
              angle={-45}
              textAnchor="end"
              height={60} 
              padding={{ left: 10, right: 10 }}
              label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
              stroke="hsl(var(--muted-foreground))"
            />
            
            <YAxis
              domain={[minYValue, maxYValue]}
              tickFormatter={(value) => `${value.toLocaleString()}`}
              stroke="hsl(var(--muted-foreground))"
              label={{ value: 'Price', angle: -90, position: 'insideLeft' }}
            />
            
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const date = typeof payload[0].payload.date === 'number' 
                    ? new Date(payload[0].payload.date) 
                    : new Date(payload[0].payload.date);
                  const formattedDate = format(date, "MMM dd, yyyy HH:mm");
                  
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-sm">
                      <p className="text-sm">Date: {formattedDate}</p>
                      <p className="text-sm font-bold">
                        Price: ${payload[0].payload.price.toLocaleString()}
                      </p>
                      <p className="text-sm">
                        Regime: {payload[0].payload.regime === 0 ? 'Regime 0' : 'Regime 1'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            {/* Updated Reference Areas to use date */}
            {regimeTransitions.map((segment, index) => (
              <ReferenceArea
                key={index}
                x1={segment.start}
                x2={segment.end}
                stroke="none"
                fill={segment.regime === 0 ? "#7fb2fa" : "#92fcbe"}
                fillOpacity={0.5}
              />
            ))}
            
            {/* Price line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#000000"
              dot={false}
              strokeWidth={1.5}
              name="Close Price"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-black mr-1"></div>
          <span className="text-sm">Close Price</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#92fcbe] mr-1"></div>
          <span className="text-sm">Regime 1</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#7fb2fa] mr-1"></div>
          <span className="text-sm">Regime 0</span>
        </div>
      </div>
    </Card>
  );
}
