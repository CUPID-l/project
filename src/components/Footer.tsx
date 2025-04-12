
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background py-8">
      <div className="container max-w-screen-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-lg font-semibold text-soilsync-primary">Soil Sync</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
            <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">
              Home
            </Link>
            <Link to="/data-entry" className="text-sm text-foreground/70 hover:text-foreground">
              Data Entry
            </Link>
            <Link to="/reports" className="text-sm text-foreground/70 hover:text-foreground">
              Reports
            </Link>
          </div>
          
          <div className="text-sm text-foreground/60">
            © {new Date().getFullYear()} Soil Sync. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
