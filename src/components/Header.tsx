"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContextProvider";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const { auth, dispatch } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout");

    // Remove user from `AuthContext`
    if (response.status === 204) {
      dispatch({ type: "logout", user: null });
      router.push("/");
    }
  };

  return (
    <header className="h-20 absolute top-0 w-full">
      <div className="h-full container mx-auto flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <MobileNavigationMenu />
          <Logo />
        </div>
        <nav className="hidden gap-3 md:flex">
          <Link href="/">Home</Link>
        </nav>
        {auth ? (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={`/${auth.username}/articles`}>My articles</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Signup</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

const MobileNavigationMenu = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <Sheet open={isSheetOpen}>
      <SheetTrigger asChild onClick={() => setIsSheetOpen(!isSheetOpen)}>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link href="/" onClick={() => setIsSheetOpen(!isSheetOpen)}>
            Home
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Header;
