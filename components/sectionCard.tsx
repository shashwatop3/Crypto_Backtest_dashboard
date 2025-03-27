import { TrendingDownIcon, TrendingUpIcon, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEditBackTest } from "@/hooks/useOpenSheet";


interface cardProps {
  profit: number;
  winRate: number;
  trades: number;
  returns: string | number;
  stploss: number;
  takeprofit: number;
  intial_capital: number;
  Quantity: number;
  current_capital: number;
  days: number;
}

export function SectionCards(data: cardProps) {
  const {
    profit,
    winRate,
    trades,
    returns,
    stploss,
    takeprofit,
    intial_capital,
    Quantity,
    current_capital,
    days,
  } = data;
  const { isOpen, onOpen } = useEditBackTest();
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 lg:px-6">
      <Card className="@container/card relative">
        {" "}
        {/* Add `relative` here */}
        <CardHeader className="relative">
          <CardDescription>Parameters</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {`Intial Capital: $${intial_capital}`}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {`Take Profit = ${takeprofit}`}{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="line-clamp-1 flex gap-2 font-medium">
            {`Stop Loss = ${stploss}`} <TrendingDownIcon className="size-4" />
          </div>
          <div className="line-clamp-1 flex gap-2 font-medium">
            {`Quantity per trade = ${Quantity}`}
          </div>
        </CardFooter>
        <div className="absolute right-4 bottom-4">
          <Button onClick={onOpen} className="line-clamp-1 flex gap-2 font-medium">
            <Edit2 className="w-4 h-4" />Edit</Button>
        </div>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Profits/Loss</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {`${profit}`}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              {`${returns}`}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Trades</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {`${trades}`}
          </CardTitle>
          <div className="absolute right-4 top-4"></div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {`trading days = ${days}`}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Returns</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {`Current Capital: $${current_capital}`}{" "}
            {/* Display Current Capital */}
            <br /> {/* Add a line break for better readability */}
            {`Returns: ${returns}`} {/* Display Returns */}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
