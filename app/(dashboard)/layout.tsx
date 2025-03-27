import { Header } from "@/components/header";
import { BacktestSheet } from "@/components/backtestSheet";
import {Footer} from "@/components/footer"
type Props = {
    children : React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <div className="h-full">
            <Header />
            <main className=' lg:px-4'>
                {children}
                <BacktestSheet />
            </main>
            <Footer />
        </div>
    )
}

export default DashboardLayout;