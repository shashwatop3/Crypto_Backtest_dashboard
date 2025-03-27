from typing import List, Union
from order_class import BuyOrder, SellOrder
import logging

class Positions:
    def __init__(self, initial_capital: float):
        self.positions: List[Union[BuyOrder, SellOrder]] = []
        self.closed_positions: List[Union[BuyOrder, SellOrder]] = []
        self.profit_loss: float = 0
        self.profit_count: int = 0
        self.loss_count: int = 0
        self.initial_capital: float = initial_capital
        self.current_capital: float = initial_capital
        self.available_capital: float = initial_capital

    def add_position(self, position: Union[BuyOrder, SellOrder]) -> None:
        position_cost = position.entry_price * position.quantity
        if isinstance(position, BuyOrder) and self.available_capital >= position_cost:
            self.available_capital -= position_cost
            self.positions.append(position)
        elif isinstance(position, SellOrder) and self.available_capital >= position_cost:
            self.available_capital += position_cost
            self.positions.append(position)
        else:
            logging.warning(f"Skipping position due to insufficient funds: {position}")

    def check_positions(self, current_price: float) -> None:
        for position in self.positions[:]:  # Create a copy to iterate
            if position.check(current_price):
                self.close_position(position, current_price)


    def close_position(self, position: Union[BuyOrder, SellOrder], close_price: float) -> None:
        position.close(close_price)
        self.profit_loss += position.pl
        if isinstance(position, BuyOrder):
            self.current_capital += position.pl
            self.available_capital += (position.quantity * close_price)
        elif isinstance(position, SellOrder):
            self.current_capital += position.pl
            self.available_capital -= (position.quantity * close_price)
        
        if position.pl > 0:
            self.profit_count += 1
        else:
            self.loss_count += 1
        
        self.closed_positions.append(position)
        self.positions.remove(position)

    def close_all_positions(self, close_price: float) -> None:
        for position in self.positions[:]:  # Create a copy to iterate
            self.close_position(position, close_price)

    def get_positions(self) -> List[Union[BuyOrder, SellOrder]]:
        return self.positions

    def get_closed_positions(self) -> List[Union[BuyOrder, SellOrder]]:
        return self.closed_positions

    def get_profit_loss(self) -> float:
        return self.profit_loss
    
    def get_success_rate(self) -> float:
        total_trades = self.profit_count + self.loss_count
        return self.profit_count / total_trades if total_trades > 0 else 0
    
    def get_profit_count(self) -> int:
        return self.profit_count
    
    def get_loss_count(self) -> int:
        return self.loss_count
    
    def get_current_capital(self) -> float:
        return self.current_capital
    
    def get_total_value(self) -> float:
        open_positions_value = sum(p.quantity * p.price for p in self.positions)
        return self.current_capital + open_positions_value
