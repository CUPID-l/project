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
  
  const handleNumberChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Store form data in localStorage to use in Results page
      localStorage.setItem("soilsyncData", JSON.stringify(formData));
      
      setLoading(false);
      toast({
        title: "Analysis Complete",
        description: "Fertilizer recommendations are ready.",
        duration: 3000,
      });
      
      navigate("/results");
    }, 1500);
  };
  
  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Soil Parameter Entry</h1>
        <p className="text-foreground/70 mb-8">
          Enter the soil parameters to get fertilizer recommendations.
        </p>
        
        <Card className="border border-border/40 bg-card/50 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
            
            <div className="flex justify-end">
              <Button
                type="submit"
                className="prediction-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Rocket size={16} />
                    <span>Get Recommendations</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DataEntry;
