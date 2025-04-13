import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import axios from "axios";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const AutoReports = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sensorRef = ref(database, 'sensors');
    onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      setSensorData(data);
    });
  }, []);

  const handleGenerateReport = async () => {
    if (!sensorData) {
      toast({
        title: "Error",
        description: "No sensor data available.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      // First get prediction from Hugging Face
      const predictionResponse = await axios.post(
        "https://cupid-i-fertilizer-pred.hf.space/predict",
        {
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          rainfall: sensorData.rainfall,
          nitrogen: sensorData.nitrogen,
          phosphorus: sensorData.phosphorus,
          potassium: sensorData.potassium,
          pH: sensorData.pH,
          soil_type: sensorData.soilType,
          crop_type: sensorData.cropType
        },
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_HF_API_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Then generate report using Gemini
      const reportResponse = await axios.post(
        import.meta.env.VITE_GEMINI_API_ENDPOINT,
        {
          contents: [{
            parts: [{
              text: `Generate a detailed fertilizer recommendation report based on the following real-time sensor data:
              Temperature: ${sensorData.temperature}°C
              Humidity: ${sensorData.humidity}%
              Rainfall: ${sensorData.rainfall}mm
              Nitrogen: ${sensorData.nitrogen}kg/ha
              Phosphorus: ${sensorData.phosphorus}kg/ha
              Potassium: ${sensorData.potassium}kg/ha
              pH: ${sensorData.pH}
              Soil Type: ${sensorData.soilType}
              Crop Type: ${sensorData.cropType}
              
              Prediction Results:
              ${JSON.stringify(predictionResponse.data, null, 2)}
              
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
        ...sensorData,
        prediction: predictionResponse.data,
        report: reportResponse.data.candidates[0].content.parts[0].text,
        timestamp: new Date().toISOString()
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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Automatic Report Generation</h1>
        <p className="text-foreground/70 mb-8">
          Generate reports based on real-time sensor data from Firebase.
        </p>
        
        <Card className="border border-border/40 bg-card/50 p-6">
          <div className="space-y-6">
            {sensorData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Current Sensor Readings</h3>
                  <div className="space-y-2">
                    <p>Temperature: {sensorData.temperature}°C</p>
                    <p>Humidity: {sensorData.humidity}%</p>
                    <p>Rainfall: {sensorData.rainfall}mm</p>
                    <p>Nitrogen: {sensorData.nitrogen}kg/ha</p>
                    <p>Phosphorus: {sensorData.phosphorus}kg/ha</p>
                    <p>Potassium: {sensorData.potassium}kg/ha</p>
                    <p>pH: {sensorData.pH}</p>
                    <p>Soil Type: {sensorData.soilType}</p>
                    <p>Crop Type: {sensorData.cropType}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-foreground/70">Waiting for sensor data...</p>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={handleGenerateReport}
                disabled={loading || !sensorData}
                className="bg-soilsync-primary hover:bg-soilsync-primary/90"
              >
                {loading ? "Generating Report..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AutoReports; 