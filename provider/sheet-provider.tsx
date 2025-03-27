"use client";
import {BacktestSheet} from "@/components/backtestSheet"
import {useMountedState} from "react-use"

export const SheetProvider = () => {
    const isMounted = useMountedState();
    if(!isMounted()) return null;

    return (
        <>
            <BacktestSheet />
        </>
        
    )
}