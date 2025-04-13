import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Data Entry", path: "data-entry" },
    { name: "Auto Reports", path: "auto-reports" },
    { name: "Reports", path: "reports" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center">
        <div className="flex items-center gap-2 mr-4">
          <Logo size={32} />
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-soilsync-primary">Soil Sync</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex"
            asChild
          >
            <Link to="/data-entry">Try Now</Link>
          </Button>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden ml-2" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border/40 p-4 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                className="text-foreground/70 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to="/data-entry">Try Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
