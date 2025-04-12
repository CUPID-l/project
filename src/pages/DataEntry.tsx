
import { useState, useEffect } from "react";
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
                <div className="flex items-center gap-3">
                  <Thermometer className="text-blue-500" size={20} />
                  <label htmlFor="temperature" className="text-sm">Temperature (°C)</label>
                </div>
                <NumberInput 
                  value={formData.temperature} 
                  onChange={(value) => handleNumberChange("temperature", value)}
                  min={-20}
                  max={50}
                  step={0.1}
                />
              </div>
              
              {/* Nitrogen */}
              <div className="parameter-input">
                <div className="flex items-center gap-3">
                  <div className="text-amber-500 font-semibold">N</div>
                  <label htmlFor="nitrogen" className="text-sm">Nitrogen (ppm)</label>
                </div>
                <NumberInput 
                  value={formData.nitrogen} 
                  onChange={(value) => handleNumberChange("nitrogen", value)}
                  min={0}
                  max={200}
                />
              </div>
              
              {/* Humidity */}
              <div className="parameter-input">
                <div className="flex items-center gap-3">
                  <Droplet className="text-blue-500" size={20} />
                  <label htmlFor="humidity" className="text-sm">Humidity (%)</label>
                </div>
                <NumberInput 
                  value={formData.humidity} 
                  onChange={(value) => handleNumberChange("humidity", value)}
                  min={0}
                  max={100}
                />
              </div>
              
              {/* Phosphorus */}
              <div className="parameter-input">
                <div className="flex items-center gap-3">
                  <div className="text-amber-500 font-semibold">P</div>
                  <label htmlFor="phosphorus" className="text-sm">Phosphorus (ppm)</label>
                </div>
                <NumberInput 
                  value={formData.phosphorus} 
                  onChange={(value) => handleNumberChange("phosphorus", value)}
                  min={0}
                  max={200}
                />
              </div>
              
              {/* Rainfall */}
              <div className="parameter-input">
                <div className="flex items-center gap-3">
                  <CloudRain className="text-blue-500" size={20} />
                  <label htmlFor="rainfall" className="text-sm">Rainfall (mm)</label>
                </div>
                <NumberInput 
                  value={formData.rainfall} 
                  onChange={(value) => handleNumberChange("rainfall", value)}
                  min={0}
                  max={1000}
                />
              </div>
              
              {/* Potassium */}
              <div className="parameter-input">
                <div className="flex items-center gap-3">
                  <div className="text-amber-500 font-semibold">K</div>
                  <label htmlFor="potassium" className="text-sm">Potassium (ppm)</label>
                </div>
                <NumberInput 
                  value={formData.potassium} 
                  onChange={(value) => handleNumberChange("potassium", value)}
                  min={0}
                  max={200}
                />
              </div>
              
              {/* Soil pH */}
              <div className="parameter-input">
                <div className="flex items-center gap-3">
                  <Ruler className="text-purple-500" size={20} />
                  <label htmlFor="pH" className="text-sm">Soil pH</label>
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
                <div className="flex items-center gap-3">
                  <Sprout className="text-green-500" size={20} />
                  <label htmlFor="soilType" className="text-sm">Soil Type</label>
                </div>
                <div className="w-full">
                  <Select
                    value={formData.soilType}
                    onValueChange={(value) => handleSelectChange("soilType", value)}
                  >
                    <SelectTrigger className="w-full border-0 focus:ring-0 focus:ring-offset-0 bg-transparent">
                      <SelectValue placeholder="Select Soil Type" />
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
              </div>
              
              {/* Crop Type */}
              <div className="parameter-input col-span-1 md:col-span-2">
                <div className="flex items-center gap-3">
                  <Leaf className="text-green-500" size={20} />
                  <label htmlFor="cropType" className="text-sm">Crop Type</label>
                </div>
                <div className="w-full">
                  <Select
                    value={formData.cropType}
                    onValueChange={(value) => handleSelectChange("cropType", value)}
                  >
                    <SelectTrigger className="w-full border-0 focus:ring-0 focus:ring-offset-0 bg-transparent">
                      <SelectValue placeholder="Select Crop Type" />
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
            </div>
            
            <Button 
              type="submit"
              className="prediction-button w-full mt-8" 
              disabled={loading}
            >
              <Rocket size={20} />
              {loading ? "Analyzing..." : "Predict Fertilizer"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DataEntry;
