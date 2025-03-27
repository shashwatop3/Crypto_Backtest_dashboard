from typing import List, Union
from order_class import BuyOrder, SellOrder


class CapitalAwarePositions:
    def __init__(self, initial_capital: float):
        self.initial_capital = initial_capital
        self.available_capital = initial_capital
        self.allocated_capital = 0.0
        self.positions: List[Union[BuyOrder, SellOrder]] = []
        self.closed_positions: List[Union[BuyOrder, SellOrder]] = []
        self.profit_count: int = 0
        self.loss_count: int = 0
        self.portfolio_values: List[float] = [initial_capital]

    def add_position(self, position: Union[BuyOrder, SellOrder]) -> bool:
        if isinstance(position, BuyOrder):
            required = position.quantity * position.entry_price
            if required > self.available_capital:
                return False
            self.available_capital -= required
        else:
            required = position.quantity * position.entry_price
            self.allocated_capital += required
            self.available_capital -= required
            
        self.positions.append(position)
        return True

    def check_positions(self, current_price: float) -> None:
        for position in self.positions.copy():
            if position.check(current_price):
                self._close_position(position, current_price)
        
        self.portfolio_values.append(self.get_portfolio_value(current_price))

    def _close_position(self, position: Union[BuyOrder, SellOrder], close_price: float):
        position.close(close_price)
        
        if isinstance(position, BuyOrder):
            proceeds = position.quantity * close_price
            self.available_capital += proceeds
        else:
            profit = (position.entry_price - close_price) * position.quantity
            self.available_capital += (self.allocated_capital + profit)
            self.allocated_capital -= position.quantity * position.entry_price

        if position.pl > 0:
            self.profit_count += 1
        else:
            self.loss_count += 1
            
        self.closed_positions.append(position)
        self.positions.remove(position)

    def close_all_positions(self, close_price: float) -> None:
        for position in self.positions.copy():
            self._close_position(position, close_price)
        portfolio_value = float(self.available_capital) + float(self.allocated_capital)
        self.portfolio_values.append(portfolio_value)
    
    def get_portfolio_value(self, current_price: float) -> float:
        open_value = sum(
            float(pos.quantity) * (float(current_price) - float(pos.entry_price)) * (1 if isinstance(pos, BuyOrder) else -1)
            for pos in self.positions
        )
        return float(self.available_capital) + float(self.allocated_capital) + open_value
    
    def get_profit_loss(self) -> float:
        return (self.available_capital + self.allocated_capital) - self.initial_capital
    
    def get_success_rate(self) -> float:
        total = self.profit_count + self.loss_count
        return self.profit_count / total if total > 0 else 0.0
    
    def get_max_drawdown(self) -> float:
        peak = self.initial_capital
        max_dd = 0.0
        for value in self.portfolio_values:
            if value > peak:
                peak = value
            dd = (peak - value) / peak
            if dd > max_dd:
                max_dd = dd
        return max_dd

    def get_positions(self) -> List[Union[BuyOrder, SellOrder]]:
        return self.positions

    def get_closed_positions(self) -> List[Union[BuyOrder, SellOrder]]:
        return self.closed_positions
    
    def get_profit_count(self) -> int:
        return self.profit_count
    
    def get_loss_count(self) -> int:
        return self.loss_count
