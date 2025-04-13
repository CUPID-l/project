import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import Layout from './components/Layout';
import Home from './pages/Home';
import DataEntry from './pages/DataEntry';
import Results from './pages/Results';
import './index.css';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background text-foreground antialiased">
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="data-entry" element={<DataEntry />} />
              <Route path="results" element={<Results />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
