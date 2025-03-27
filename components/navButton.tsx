import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";


interface Props {
  href: string;
  name: string;
  isActive: boolean;
}

const NavButton = ({
  href,
  name,
  isActive
}: Props) => {
  return (
    <Button asChild
      variant="outline"
      size='sm'
      className={cn("w-full lg:w-auto item-center font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/20 transition",
        isActive ? "bg-white/20 text-white" : "bg-transparent"
      )}>
      <Link href={href}>
        {name}
      </Link>
    </Button>
  )
}

export default NavButton;