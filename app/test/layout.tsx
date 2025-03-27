import { Header } from "@/components/header";

type Props = {
    children : React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
    return (
        <div className="bg-white h-full">
            <main className='px-3 lg:px-4'>
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout;