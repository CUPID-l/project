import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Layout from './components/Layout';
import Index from './pages/Index';
import DataEntry from './pages/DataEntry';
import AutoReports from './pages/AutoReports';
import Results from './pages/Results';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';
import './index.css';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="soilsync-theme">
        <Router>
          <Toaster />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="data-entry" element={<DataEntry />} />
              <Route path="auto-reports" element={<AutoReports />} />
              <Route path="results" element={<Results />} />
              <Route path="reports" element={<Reports />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
