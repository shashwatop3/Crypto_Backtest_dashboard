import { usePathname, useRouter } from 'next/navigation';
import NavButton from './navButton';
import { useMedia } from "react-use";
import { useState } from "react";
import { Button } from './ui/button';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';

const routes = [
  { href: '/', name: 'Home' },

];

export const Navigation = () => {
    const [isOpen, setOpen] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const isMobile = useMedia("(max-width: 1024px)", false);

    const onClick = (href: string) => {
        router.push(href);
        setOpen(false);
    }

    if (isMobile) {
        return (
          <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => setOpen(!isOpen)} 
                variant="outline" 
                size="sm"
                className="font-normal bg-white/10 hover:bg-white/20
                hover:text-white border-none focus-visible:ring-offset-0
                focus-visible:ring-transparent outline-none text-white
                focus:bg-white/30 transition">
                <Menu className="w-6 h-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className='px-2'>
            <SheetTitle>Navigation</SheetTitle>
              <nav className="flex flex-col gap-y-4 items-center mt-4">
                {routes.map((route, index) => (
                  <Button 
                    key={index}
                    variant={pathname === route.href ? 'outline' : 'ghost'}
                    size='sm'
                    className="w-full justify-start"
                    onClick={() => onClick(route.href)}>
                    {route.name}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        );
      }

    return (
        <nav className="hidden lg:flex gap-x-4 overflow-x-auto items-center">
        {routes.map((route, index) => (
            <NavButton 
            key={index} 
            href={route.href} 
            name={route.name}
            isActive={pathname === route.href} />
        ))}
        </nav>
    )
}