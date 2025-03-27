import CurrencyInput from "react-currency-input-field";
import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const AmountInput = ({
  value,
  onChange,
  disabled,
  placeholder,
}: Props) => {
  const parseValue = parseFloat(value);
  const isIncome = parseValue > 0;
  const isExpense = parseValue < 0;

  const onReverseValue = () => {
    if (!value) return;
    const newValue = (parseValue * -1).toString();
    onChange(newValue);
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReverseValue}
              className={cn(
                "absolute top-1/2 right-2 transform -translate-y-1/2",
                "text-lg text-muted-foreground",
                "focus:outline-none",
                "hover:text-accent-foreground"
              )}
            >
              {isIncome ? <PlusCircle /> : <MinusCircle />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{isIncome ? "Income" : "Expense"}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CurrencyInput
        prefix="$"
        className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        placeholder={placeholder}
        value={value}
        decimalScale={2}
        decimalsLimit={2}
        onValueChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};