
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  ArrowLeft, 
  FileText, 
  Share2, 
  Thermometer, 
  Droplet, 
  CloudRain,
  Ruler, 
  Leaf, 
  Sprout
} from "lucide-react";

// Define the types for our data
interface SoilData {
  temperature: number;
  humidity: number;
  rainfall: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  soilType: string;
  cropType: string;
}

interface FertilizerRecommendation {
  name: string;
  npkRatio: string;
  applicationRate: string;
  description: string;
  soilImprovement: string[];
}

// Sample fertilizer mapping based on crop and soil conditions
const getFertilizerRecommendation = (data: SoilData): FertilizerRecommendation => {
  // In a real application, this would be determined by an API call or ML model
  // This is a simplified example
  
  const cropTypeFertilizers: Record<string, FertilizerRecommendation> = {
    "Wheat": {
      name: "High Nitrogen Wheat Fertilizer",
      npkRatio: "20-10-10",
      applicationRate: "250-300 kg/ha",
      description: "Balanced formula designed for wheat crops, with higher nitrogen content to promote vegetative growth.",
      soilImprovement: ["Improves soil structure", "Enhances water retention", "Promotes beneficial microorganisms"]
    },
    "Rice": {
      name: "Rice Crop Booster",
      npkRatio: "15-15-15",
      applicationRate: "200-250 kg/ha",
      description: "Balanced formula for rice paddies with equal parts nitrogen, phosphorus and potassium.",
      soilImprovement: ["Improves soil fertility", "Reduces waterlogging effects", "Enhances root development"]
    },
    "Corn": {
      name: "Corn Growth Formula",
      npkRatio: "12-24-12",
      applicationRate: "300-350 kg/ha",
      description: "High phosphorus formula to support corn's energy requirements during growth stages.",
      soilImprovement: ["Increases phosphorus availability", "Enhances stalk strength", "Improves drought resistance"]
    },
    "Soybean": {
      name: "Legume Enhancer",
      npkRatio: "3-10-30",
      applicationRate: "150-200 kg/ha",
      description: "Low nitrogen, high potassium formula ideal for nitrogen-fixing legumes like soybeans.",
      soilImprovement: ["Promotes nodule formation", "Enhances nitrogen fixation", "Improves root development"]
    },
    "Cotton": {
      name: "Cotton Booster",
      npkRatio: "5-15-15",
      applicationRate: "200-250 kg/ha",
      description: "Balanced formula with emphasis on phosphorus and potassium for cotton quality.",
      soilImprovement: ["Improves fiber strength", "Enhances boll development", "Reduces susceptibility to pests"]
    },
    "Sugarcane": {
      name: "Sugarcane Special",
      npkRatio: "16-16-8",
      applicationRate: "350-400 kg/ha",
      description: "High nitrogen and phosphorus formula to support sugarcane's vigorous growth and sugar content.",
      soilImprovement: ["Improves sucrose content", "Enhances stem development", "Increases drought tolerance"]
    },
    "Potato": {
      name: "Tuber Growth Formula",
      npkRatio: "8-24-24",
      applicationRate: "300-350 kg/ha",
      description: "High phosphorus and potassium formula for tuber development and disease resistance.",
      soilImprovement: ["Promotes tuber formation", "Reduces common scab", "Improves storage quality"]
    },
    "Tomato": {
      name: "Tomato Fruiting Formula",
      npkRatio: "4-7-10",
      applicationRate: "150-200 kg/ha",
      description: "Low nitrogen, high potassium formula ideal for tomato fruiting stages.",
      soilImprovement: ["Reduces blossom end rot", "Improves fruit quality", "Enhances disease resistance"]
    },
    "Carrot": {
      name: "Root Vegetable Enhancer",
      npkRatio: "5-10-10",
      applicationRate: "200-250 kg/ha",
      description: "Balanced formula with lower nitrogen to prevent forking in root vegetables.",
      soilImprovement: ["Improves root development", "Enhances soil structure", "Reduces pest susceptibility"]
    },
    "Onion": {
      name: "Allium Crop Formula",
      npkRatio: "10-20-20",
      applicationRate: "200-250 kg/ha",
      description: "Phosphorus and potassium rich formula for bulb development in onions.",
      soilImprovement: ["Enhances bulb formation", "Improves storage quality", "Reduces bolting tendency"]
    }
  };

  // Default fallback
  const defaultRecommendation: FertilizerRecommendation = {
    name: "Balanced NPK Fertilizer",
    npkRatio: "10-10-10",
    applicationRate: "200-300 kg/ha",
    description: "General purpose balanced fertilizer suitable for most crops and soil conditions.",
    soilImprovement: ["Improves overall soil fertility", "Balanced nutrient profile", "Suitable for most crops"]
  };

  // Return crop-specific fertilizer or default if not found
  return cropTypeFertilizers[data.cropType] || defaultRecommendation;
};

// Calculate optimal application timing based on soil moisture and temperature
const getApplicationTiming = (humidity: number, temperature: number): string => {
  if (humidity > 80) {
    return "Wait for drier conditions before application";
  } else if (humidity < 30) {
    return "Early morning or evening application recommended";
  } else if (temperature > 30) {
    return "Apply during cooler parts of the day";
  } else if (temperature < 10) {
    return "Wait for warmer conditions for optimal nutrient uptake";
  } else {
    return "Current conditions are suitable for fertilizer application";
  }
};

const Results = () => {
  const navigate = useNavigate();
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [recommendation, setRecommendation] = useState<FertilizerRecommendation | null>(null);
  const [applicationTiming, setApplicationTiming] = useState<string>("");

  useEffect(() => {
    // Retrieve the soil data from localStorage
    const savedData = localStorage.getItem("soilsyncData");
    
    if (!savedData) {
      // Redirect to data entry if no data is found
      navigate("/data-entry");
      return;
    }
    
    try {
      const parsedData = JSON.parse(savedData) as SoilData;
      setSoilData(parsedData);
      
      // Generate fertilizer recommendation
      const fertilizerRec = getFertilizerRecommendation(parsedData);
      setRecommendation(fertilizerRec);
      
      // Generate timing recommendation
      const timing = getApplicationTiming(parsedData.humidity, parsedData.temperature);
      setApplicationTiming(timing);
      
    } catch (error) {
      console.error("Error processing soil data:", error);
      navigate("/data-entry");
    }
  }, [navigate]);

  if (!soilData || !recommendation) {
    return (
      <div className="container max-w-screen-xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit" 
            onClick={() => navigate("/data-entry")}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Data Entry
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold">Fertilizer Recommendation</h1>
          <p className="text-foreground/70">
            Based on your soil parameters, here's the optimal fertilizer recommendation.
          </p>
        </div>
        
        <div className="grid gap-6">
          {/* Recommendation Card */}
          <Card className="border border-border/40 bg-gradient-to-br from-soilsync-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{recommendation.name}</span>
                <Badge variant="outline" className="bg-soilsync-primary/20 text-soilsync-primary border-soilsync-primary/30">
                  NPK {recommendation.npkRatio}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Application Rate</h3>
                <p className="text-foreground/80">{recommendation.applicationRate}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-foreground/80">{recommendation.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Application Timing</h3>
                <p className="text-foreground/80">{applicationTiming}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Soil Improvement Benefits</h3>
                <ul className="space-y-2">
                  {recommendation.soilImprovement.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={18} className="text-soilsync-primary mt-0.5" />
                      <span className="text-foreground/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Input Parameters Summary */}
          <Card className="border border-border/40">
            <CardHeader>
              <CardTitle>Soil Parameters Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Thermometer className="text-blue-500" size={18} />
                  <span className="text-foreground/70">Temperature:</span>
                  <span className="font-medium">{soilData.temperature} °C</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-amber-500 font-semibold">N</div>
                  <span className="text-foreground/70">Nitrogen:</span>
                  <span className="font-medium">{soilData.nitrogen} ppm</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Droplet className="text-blue-500" size={18} />
                  <span className="text-foreground/70">Humidity:</span>
                  <span className="font-medium">{soilData.humidity}%</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-amber-500 font-semibold">P</div>
                  <span className="text-foreground/70">Phosphorus:</span>
                  <span className="font-medium">{soilData.phosphorus} ppm</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CloudRain className="text-blue-500" size={18} />
                  <span className="text-foreground/70">Rainfall:</span>
                  <span className="font-medium">{soilData.rainfall} mm</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-amber-500 font-semibold">K</div>
                  <span className="text-foreground/70">Potassium:</span>
                  <span className="font-medium">{soilData.potassium} ppm</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Ruler className="text-purple-500" size={18} />
                  <span className="text-foreground/70">Soil pH:</span>
                  <span className="font-medium">{soilData.pH}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Sprout className="text-green-500" size={18} />
                  <span className="text-foreground/70">Soil Type:</span>
                  <span className="font-medium">{soilData.soilType}</span>
                </div>
                
                <div className="flex items-center gap-3 col-span-1 md:col-span-2">
                  <Leaf className="text-green-500" size={18} />
                  <span className="text-foreground/70">Crop Type:</span>
                  <span className="font-medium">{soilData.cropType}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              <FileText size={18} className="mr-2" />
              Download Report
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 size={18} className="mr-2" />
              Share Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
