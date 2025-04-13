import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import Layout from './components/Layout';
import Home from './pages/Home';
import ManualDataEntry from './pages/ManualDataEntry';
import ReportGeneration from './pages/ReportGeneration';
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
              <Route path="manual-entry" element={<ManualDataEntry />} />
              <Route path="generate-report" element={<ReportGeneration />} />
              <Route path="results" element={<Results />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
