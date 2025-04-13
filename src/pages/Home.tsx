import { Link } from 'react-router-dom';
import { useTheme } from '../components/theme-provider';

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card">
        <h1 className="text-3xl font-bold mb-6">Soil Sync - Fertilizer Optimization</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="btn-primary"
          >
            {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/data-entry" className="card hover:bg-accent/10 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Data Entry</h2>
            <p className="text-muted-foreground">
              Enter soil parameters and get fertilizer recommendations
            </p>
          </Link>

          <Link to="/results" className="card hover:bg-accent/10 transition-colors">
            <h2 className="text-xl font-semibold mb-2">View Results</h2>
            <p className="text-muted-foreground">
              Check your previous recommendations and analysis
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
} 