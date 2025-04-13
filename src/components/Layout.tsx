import { Link, Outlet } from 'react-router-dom';
import { useTheme } from './theme-provider';

export default function Layout() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold">
              Soil Sync
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/manual-entry" className="hover:text-primary transition-colors">
                Manual Entry
              </Link>
              <Link to="/generate-report" className="hover:text-primary transition-colors">
                Generate Report
              </Link>
              <Link to="/results" className="hover:text-primary transition-colors">
                Results
              </Link>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="btn-primary"
              >
                {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
