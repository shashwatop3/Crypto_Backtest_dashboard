from typing import List, Union
from order_class import BuyOrder, SellOrder


class Positions:
    def __init__(self):
        self.positions: List[Union[BuyOrder, SellOrder]] = []  
        self.closed_positions: List[Union[BuyOrder, SellOrder]] = []  
        self.profit_loss: float = 0  
        self.profit_count: int = 0
        self.loss_count: int = 0

    def add_position(self, position: Union[BuyOrder, SellOrder]) -> None:
        self.positions.append(position)

    def check_positions(self, current_price: float) -> None:
        for position in self.positions:
            if(position.check(current_price)):
                self.close_position(position, current_price)


    def close_position(self, position: Union[BuyOrder, SellOrder], close_price: float) -> None:
        position.close(close_price)
        self.profit_loss += position.pl
        if(position.pl > 0):
            self.profit_count += 1
        else:
            self.loss_count += 1
        self.closed_positions.append(position)
        self.positions.remove(position)

    def close_all_positions(self, close_price: float) -> None:
        for position in self.positions:
            position.close(close_price)
            self.profit_loss += position.pl
            self.closed_positions.append(position)
        self.positions = []

    def get_positions(self) -> List[Union[BuyOrder, SellOrder]]:
        return self.positions

    def get_closed_positions(self) -> List[Union[BuyOrder, SellOrder]]:
        return self.closed_positions

    def get_profit_loss(self) -> float:
        return self.profit_loss
    
    def get_success_rate(self) -> float:
        return self.profit_count / (self.profit_count + self.loss_count) if self.profit_count + self.loss_count > 0 else 0
    
    def get_profit_count(self) -> int:
        return self.profit_count
    
    def get_loss_count(self) -> int:
        return self.loss_count