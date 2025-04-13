import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Initialize Firebase (make sure to add your config)
const firebaseConfig = {
  // Your Firebase config here
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type SoilData = {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  ph: string;
  rainfall: string;
  temperature: string;
  humidity: string;
  soilType: string;
  prediction?: {
    fertilizer: string;
    confidence: number;
    applicationRate: string;
  };
};

export default function ReportGeneration() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string>('');
  const [firebaseData, setFirebaseData] = useState<SoilData[]>([]);
  const [selectedData, setSelectedData] = useState<SoilData | null>(null);

  useEffect(() => {
    // Load data from Firebase
    const fetchFirebaseData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'soil_data'));
        const data: SoilData[] = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data() as SoilData);
        });
        setFirebaseData(data);
      } catch (error) {
        console.error('Error fetching Firebase data:', error);
      }
    };

    // Load manual data if coming from manual entry
    const loadManualData = () => {
      const savedData = localStorage.getItem('soilData');
      if (savedData) {
        setSelectedData(JSON.parse(savedData));
      }
    };

    if (location.state?.source === 'manual') {
      loadManualData();
    } else {
      fetchFirebaseData();
    }
  }, [location.state]);

  const generateReport = async () => {
    if (!selectedData) {
      alert('Please select data to generate a report');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedData),
      });

      if (!response.ok) {
        throw new Error('Report generation failed');
      }

      const result = await response.json();
      setReport(result.report);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Generate Detailed Report</h1>

        {location.state?.source !== 'manual' && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Select Data from Firebase</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {firebaseData.map((data, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedData(data)}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedData === data 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p><strong>Soil Type:</strong> {data.soilType}</p>
                  <p><strong>pH:</strong> {data.ph}</p>
                  <p><strong>Temperature:</strong> {data.temperature}°C</p>
                  {data.prediction && (
                    <p className="text-primary"><strong>Predicted:</strong> {data.prediction.fertilizer}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedData && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Selected Data</h2>
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <p><strong>Soil Type:</strong> {selectedData.soilType}</p>
              <p><strong>pH Level:</strong> {selectedData.ph}</p>
              <p><strong>NPK Values:</strong> {selectedData.nitrogen}-{selectedData.phosphorus}-{selectedData.potassium}</p>
              {selectedData.prediction && (
                <>
                  <p><strong>Recommended Fertilizer:</strong> {selectedData.prediction.fertilizer}</p>
                  <p><strong>Confidence:</strong> {(selectedData.prediction.confidence * 100).toFixed(2)}%</p>
                </>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={generateReport}
            disabled={!selectedData || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Generating Report...' : 'Generate Report with Gemini AI'}
          </button>

          {report && (
            <div className="p-4 bg-muted/30 rounded-lg prose prose-invert max-w-none">
              <h2 className="text-lg font-semibold mb-2">Generated Report</h2>
              <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br>') }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 