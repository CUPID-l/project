import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FormData = {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
  rainfall: string;
  temperature: string;
  humidity: string;
  soilType: string;
};

type PredictionResult = {
  fertilizer: string;
  confidence: number;
  applicationRate: string;
};

export default function ManualDataEntry() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    rainfall: '',
    temperature: '',
    humidity: '',
    soilType: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);

      // Store the data for report generation
      localStorage.setItem('soilData', JSON.stringify({
        ...formData,
        prediction: result
      }));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = () => {
    navigate('/generate-report', { state: { source: 'manual' } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manual Soil Data Entry</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="nitrogen" className="block text-sm font-medium mb-1">
                Nitrogen (mg/kg)
              </label>
              <input
                type="number"
                id="nitrogen"
                name="nitrogen"
                value={formData.nitrogen}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="phosphorus" className="block text-sm font-medium mb-1">
                Phosphorus (mg/kg)
              </label>
              <input
                type="number"
                id="phosphorus"
                name="phosphorus"
                value={formData.phosphorus}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="potassium" className="block text-sm font-medium mb-1">
                Potassium (mg/kg)
              </label>
              <input
                type="number"
                id="potassium"
                name="potassium"
                value={formData.potassium}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="ph" className="block text-sm font-medium mb-1">
                pH Level
              </label>
              <input
                type="number"
                id="ph"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                className="input-field"
                step="0.1"
                min="0"
                max="14"
                required
              />
            </div>

            <div>
              <label htmlFor="rainfall" className="block text-sm font-medium mb-1">
                Rainfall (mm)
              </label>
              <input
                type="number"
                id="rainfall"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="temperature" className="block text-sm font-medium mb-1">
                Temperature (°C)
              </label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="humidity" className="block text-sm font-medium mb-1">
                Humidity (%)
              </label>
              <input
                type="number"
                id="humidity"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                className="input-field"
                min="0"
                max="100"
                required
              />
            </div>

            <div>
              <label htmlFor="soilType" className="block text-sm font-medium mb-1">
                Soil Type
              </label>
              <select
                id="soilType"
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select soil type</option>
                <option value="sandy">Sandy</option>
                <option value="loamy">Loamy</option>
                <option value="clay">Clay</option>
                <option value="silt">Silt</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Getting Prediction...' : 'Get Fertilizer Prediction'}
            </button>

            {prediction && (
              <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                <h2 className="text-lg font-semibold">Prediction Result</h2>
                <p><strong>Recommended Fertilizer:</strong> {prediction.fertilizer}</p>
                <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>
                <p><strong>Application Rate:</strong> {prediction.applicationRate}</p>
                
                <button 
                  type="button"
                  onClick={handleGenerateReport}
                  className="btn-primary w-full mt-4"
                >
                  Generate Detailed Report
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 