class BuyOrder:
    def __init__(self, entry_price, quantity, stoploss=None, takeprofit=None):
        self.entry_price = entry_price
        self.quantity = quantity
        self.stoploss = (1-stoploss)*entry_price if stoploss is not None else None
        self.takeprofit = (1+takeprofit)*entry_price if takeprofit is not None else None
        self.status = 'open'
    def close(self, close_price):
        self.close_price = close_price
        self.pl = self.quantity * (self.close_price - self.entry_price)
        self.status = 'closed'
    def check(self, current_price):
        if self.stoploss is not None and current_price <= self.stoploss:
            return True
        elif self.takeprofit is not None and current_price >= self.takeprofit:
            return True
        return False
    
class SellOrder:
    def __init__(self, entry_price, quantity, stoploss=None, takeprofit=None):
        self.entry_price = entry_price
        self.quantity = quantity
        self.stoploss = (1+stoploss)*entry_price if stoploss is not None else None
        self.takeprofit = (1-takeprofit)*entry_price if takeprofit is not None else None
        self.status = 'open'
    def close(self, close_price):
        self.close_price = close_price
        self.pl = self.quantity * (self.entry_price - self.close_price)
        self.status = 'closed'
    def check(self, current_price) -> bool:
        if self.stoploss is not None and current_price >= self.stoploss:
            return True
        elif self.takeprofit is not None and current_price <= self.takeprofit:
            return True
        return False