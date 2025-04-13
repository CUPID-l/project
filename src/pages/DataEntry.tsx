import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";

type FormData = {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
  rainfall: string;
  temperature: string;
  humidity: string;
  soilType: string;
  cropType: string;
};

const soilTypes = [
  "Clay",
  "Loamy",
  "Sandy",
  "Silt",
  "Peaty",
  "Chalky",
  "Sandy Loam",
];

const cropTypes = [
  "Wheat",
  "Rice",
  "Corn",
  "Soybean",
  "Cotton",
  "Sugarcane",
  "Potato",
  "Tomato",
  "Carrot",
  "Onion",
];

const DataEntry = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    rainfall: '',
    temperature: '',
    humidity: '',
    soilType: '',
    cropType: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePredict();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePredict = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.temperature || !formData.humidity || !formData.rainfall || 
          !formData.nitrogen || !formData.phosphorus || !formData.potassium || 
          !formData.ph || !formData.soilType || !formData.cropType) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const response = await axios.post(
        "https://cupid-i-fertilizer-pred.hf.space/predict",
        {
          inputs: {
            temperature: parseFloat(formData.temperature),
            humidity: parseFloat(formData.humidity),
            rainfall: parseFloat(formData.rainfall),
            nitrogen: parseFloat(formData.nitrogen),
            phosphorus: parseFloat(formData.phosphorus),
            potassium: parseFloat(formData.potassium),
            pH: parseFloat(formData.ph),
            soil_type: formData.soilType.toLowerCase(),
            crop_type: formData.cropType.toLowerCase()
          }
        },
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_HF_API_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.data) {
        throw new Error("No prediction data received");
      }

      setPrediction(response.data);
      toast({
        title: "Prediction Complete",
        description: "Fertilizer prediction is ready.",
        duration: 3000,
      });
      await handleGenerateReport();
    } catch (error) {
      console.error("Prediction error:", error);
      let errorMessage = "Failed to get prediction. Please try again.";
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Please check your API token.";
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid input data. Please check your values.";
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!prediction) {
      toast({
        title: "Error",
        description: "Please get a prediction first.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_GEMINI_API_ENDPOINT,
        {
          contents: [{
            parts: [{
              text: `Generate a detailed fertilizer recommendation report based on the following data:
              Temperature: ${formData.temperature}°C
              Humidity: ${formData.humidity}%
              Rainfall: ${formData.rainfall}mm
              Nitrogen: ${formData.nitrogen}kg/ha
              Phosphorus: ${formData.phosphorus}kg/ha
              Potassium: ${formData.potassium}kg/ha
              pH: ${formData.ph}
              Soil Type: ${formData.soilType}
              Crop Type: ${formData.cropType}
              
              Prediction Results:
              ${JSON.stringify(prediction, null, 2)}
              
              Please provide:
              1. Detailed analysis of the soil conditions
              2. Specific fertilizer recommendations
              3. Application guidelines
              4. Expected outcomes
              5. Additional considerations`
            }]
          }]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY
          }
        }
      );

      const reportData = {
        ...formData,
        prediction,
        report: response.data.candidates[0].content.parts[0].text
      };

      localStorage.setItem("soilsyncData", JSON.stringify(reportData));
      navigate("/results");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
    setLoading(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Soil Data Entry</h1>
        
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
                {soilTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cropType" className="block text-sm font-medium mb-1">
                Crop Type
              </label>
              <select
                id="cropType"
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select crop type</option>
                {cropTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button 
              type="submit" 
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get Recommendations'
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Generating prediction and report. This may take a few moments...
          </div>
        )}
      </div>
    </div>
  );
};

export default DataEntry;
