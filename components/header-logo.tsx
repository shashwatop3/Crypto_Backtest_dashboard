import Link from "next/link"
import Image from "next/image"


export const Header_logo = () => {
    return (
        <Link href="/">
            <div className="lg:flex items-center hidden">
                <Image src="/logo.svg" alt="logo" width={28} height={28} />
                <h1 className='text-2xl font-bold text-white mx-3'>Logo</h1>
            </div>
        </Link>
    )
}