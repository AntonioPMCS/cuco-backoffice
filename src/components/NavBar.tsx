import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import ConnectionBar from "./ConnectionBar";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-5">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">C</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">CUCoBlockchain</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10">
              <Link to="/devices" className="text-base font-medium transition-colors hover:text-primary">
                Devices
              </Link>
              <Link to="/customers" className="text-base font-medium transition-colors hover:text-primary">
                Customers
              </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <ConnectionBar />
            </div>
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 pt-6">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">N</span>
                    </div>
                    <span className="font-bold text-xl">Navbar</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    <Link
                      to="/devices"
                      className="text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Devices
                    </Link>
                    <Link
                      to="/customers"
                      className="text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      Customers
                    </Link>
                  </nav>
                  <div className="flex flex-col gap-2 mt-auto">
                    <ConnectionBar />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}

export default NavBar
