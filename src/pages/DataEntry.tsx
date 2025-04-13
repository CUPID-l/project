import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Thermometer, 
  Droplet, 
  CloudRain, 
  Ruler, 
  Leaf, 
  Sprout, 
  Rocket
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import NumberInput from "@/components/NumberInput";
import axios from "axios";

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
  
  const [formData, setFormData] = useState({
    temperature: 25.0,
    humidity: 60.0,
    rainfall: 100.0,
    nitrogen: 40.0,
    phosphorus: 30.0,
    potassium: 20.0,
    pH: 6.5,
    soilType: "Clay",
    cropType: "Wheat"
  });
  
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  
  const handleNumberChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://cupid-i-fertilizer-pred.hf.space/predict",
        {
          temperature: formData.temperature,
          humidity: formData.humidity,
          rainfall: formData.rainfall,
          nitrogen: formData.nitrogen,
          phosphorus: formData.phosphorus,
          potassium: formData.potassium,
          pH: formData.pH,
          soil_type: formData.soilType,
          crop_type: formData.cropType
        },
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_HF_API_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      setPrediction(response.data);
      toast({
        title: "Prediction Complete",
        description: "Fertilizer prediction is ready.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get prediction. Please try again.",
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
              pH: ${formData.pH}
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
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Soil Parameter Entry</h1>
        <p className="text-foreground/70 mb-8">
          Enter the soil parameters to get fertilizer recommendations.
        </p>
        
        <Card className="border border-border/40 bg-card/50 p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Temperature */}
              <div className="parameter-input">
                <div className="flex items-center gap-2">
                  <Thermometer className="text-soilsync-primary" size={20} />
                  <span className="font-medium">Temperature (°C)</span>
                </div>
                <NumberInput 
                  value={formData.temperature} 
                  onChange={(value) => handleNumberChange("temperature", value)}
                  min={0}
                  max={50}
                  step={0.1}
                />
              </div>
              
              {/* Humidity */}
              <div className="parameter-input">
                <div className="flex items-center gap-2">
                  <Droplet className="text-soilsync-primary" size={20} />
                  <span className="font-medium">Humidity (%)</span>
                </div>
                <NumberInput
                  value={formData.humidity}
                  onChange={(value) => handleNumberChange("humidity", value)}
                  min={0}
                  max={100}
                  step={0.1}
                />
              </div>
              
              {/* Rainfall */}
              <div className="parameter-input">
                <div className="flex items-center gap-2">
                  <CloudRain className="text-soilsync-primary" size={20} />
                  <span className="font-medium">Rainfall (mm)</span>
                </div>
                <NumberInput
                  value={formData.rainfall}
                  onChange={(value) => handleNumberChange("rainfall", value)}
                  min={0}
                  max={1000}
                  step={1}
                />
              </div>
              
              {/* Nitrogen */}
              <div className="parameter-input">
                <div className="flex items-center gap-2">
                  <Leaf className="text-soilsync-primary" size={20} />
                  <span className="font-medium">Nitrogen (kg/ha)</span>
                </div>
                <NumberInput 
                  value={formData.nitrogen} 
                  onChange={(value) => handleNumberChange("nitrogen", value)}
                  min={0}
                  max={200}
                  step={0.1}
                />
              </div>
              
              {/* Phosphorus */}
              <div className="parameter-input">
                <div className="flex items-center gap-2">
                  <Leaf className="text-soilsync-primary" size={20} />
                  <span className="font-medium">Phosphorus (kg/ha)</span>
                </div>
                <NumberInput 
                  value={formData.phosphorus} 
                  onChange={(value) => handleNumberChange("phosphorus", value)}
                  min={0}
                  max={200}
                  step={0.1}
                />
              </div>
              
              {/* Potassium */}
              <div className="parameter-input">
                <div className="flex items-center gap-2">
                  <Leaf className="text-soilsync-primary" size={20} />
                  <span className="font-medium">Potassium (kg/ha)</span>
                </div>
                <NumberInput 
                  value={formData.potassium} 
                  onChange={(value) => handleNumberChange("potassium", value)}
                  min={0}
                  max={200}
                  step={0.1}
                />
              </div>
              
              {/* pH */}
              <div className="parameter-input">
                <div className="flex items-center gap-2">
                  <Ruler className="text-soilsync-primary" size={20} />
                  <span className="font-medium">pH</span>
                </div>
                <NumberInput 
                  value={formData.pH} 
                  onChange={(value) => handleNumberChange("pH", value)}
                  min={0}
                  max={14}
                  step={0.1}
                />
              </div>
              
              {/* Soil Type */}
              <div className="parameter-input">
                <div className="flex items-center gap-2">
                  <Sprout className="text-soilsync-primary" size={20} />
                  <span className="font-medium">Soil Type</span>
                </div>
                <Select
                  value={formData.soilType}
                  onValueChange={(value) => handleSelectChange("soilType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Crop Type */}
              <div className="parameter-input">
                <div className="flex items-center gap-2">
                  <Leaf className="text-soilsync-primary" size={20} />
                  <span className="font-medium">Crop Type</span>
                </div>
                <Select
                  value={formData.cropType}
                  onValueChange={(value) => handleSelectChange("cropType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-4 justify-end">
              <Button 
                type="button"
                onClick={handlePredict}
                disabled={loading}
                className="bg-soilsync-primary hover:bg-soilsync-primary/90"
              >
                {loading ? "Predicting..." : "Get Prediction"}
              </Button>
              
              <Button 
                type="button"
                onClick={handleGenerateReport}
                disabled={loading || !prediction}
                variant="outline"
              >
                {loading ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DataEntry;
