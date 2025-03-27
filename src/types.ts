
interface DataPoint {
    index: number;
    price: number;
    regime: 0 | 1;
    date: string | number; // Date can be string or timestamp
  }
  
  interface Bitcoin_price {
    Datetime: string;
    Price: number;
  }
  interface LineChartComponentProps {
    data: Bitcoin_price[];
    title: string;
  }
  
  interface BitcoinRegimeChartProps {
    data: DataPoint[];
    title?: string;
    maxYValue?: number;
  }
  
  interface PortfolioData {
    Date: string; // ISO string format
    Capital: number;
  }
  
  interface CumulativePortfolioChartProps {
    data: PortfolioData[];
    title?: string;
  }
  
  interface BarChartData {
    Date: string;
    Profit: number;
  }
  interface PieChartData {
    name: string;
    value: number;
  }
  
  interface cardProps {
    profit: string | number;
    winRate: number;
    trades: number;
    returns: string | number;
    stploss: number;
    takeprofit: number;
  }
  