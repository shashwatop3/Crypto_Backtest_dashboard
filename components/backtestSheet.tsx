"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBacktestState } from "@/hooks/use-backtest-state";
import { useEditBackTest } from "@/hooks/useOpenSheet";

type FormValues = {
  days: number;
  stop_loss: number;
  take_profit: number;
  initial_capital: number;
  Quantity: number;
};

export function BacktestSheet() {
  const { state, setBacktestState } = useBacktestState();
  const { isOpen, onClose } = useEditBackTest();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      days: 90,
      stop_loss: 0.001,
      take_profit: 0.004,
      initial_capital: 100000,
      Quantity: 0.1,
    },
  });

  useEffect(() => {
    if (state) {
      reset(state);
    }
  }, [state, reset]);

  if (!state) return null;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setBacktestState(data);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose} key={String(isOpen)}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configure Backtest</SheetTitle>
          <SheetDescription>
            Enter the parameters for the backtest and click "Save changes" to apply.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Days Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="days" className="text-right">
                Days
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="days"
                  type="number"
                  {...register("days", {
                    required: "Days is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Minimum 1 day" }
                  })}
                />
                {errors.days && (
                  <p className="text-sm text-red-500">{errors.days.message}</p>
                )}
              </div>
            </div>

            {/* Stop Loss Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stop_loss" className="text-right">
                Stop Loss
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="stop_loss"
                  type="number"
                  step="0.001"
                  {...register("stop_loss", {
                    required: "Stop loss is required",
                    valueAsNumber: true,
                    min: { value: 0.0001, message: "Minimum 0.0001" }
                  })}
                />
                {errors.stop_loss && (
                  <p className="text-sm text-red-500">{errors.stop_loss.message}</p>
                )}
              </div>
            </div>

            {/* Take Profit Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="take_profit" className="text-right">
                Take Profit
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="take_profit"
                  type="number"
                  step="0.001"
                  {...register("take_profit", {
                    required: "Take profit is required",
                    valueAsNumber: true,
                    min: { value: 0.0001, message: "Minimum 0.0001" }
                  })}
                />
                {errors.take_profit && (
                  <p className="text-sm text-red-500">{errors.take_profit.message}</p>
                )}
              </div>
            </div>

            {/* Initial Capital Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="initial_capital" className="text-right">
                Initial Capital
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="initial_capital"
                  type="number"
                  {...register("initial_capital", {
                    required: "Initial capital is required",
                    valueAsNumber: true,
                    min: { value: 1000, message: "Minimum $1,000" }
                  })}
                />
                {errors.initial_capital && (
                  <p className="text-sm text-red-500">{errors.initial_capital.message}</p>
                )}
              </div>
            </div>

            {/* Quantity Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="Quantity"
                  type="number"
                  step="0.0001"
                  {...register("Quantity", {
                    required: "Quantity is required",
                    valueAsNumber: true,
                    min: { value: 0.0001, message: "Minimum 0.0001" }
                  })}
                />
                {errors.Quantity && (
                  <p className="text-sm text-red-500">{errors.Quantity.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
