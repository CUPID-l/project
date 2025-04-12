import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

export interface SensorReading {
  timestamp: number;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  temperature: number;
  humidity: number;
  cropType: string;
  fertilizer?: string;
}

export const saveSensorReading = async (reading: SensorReading): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'sensorReadings'), {
      ...reading,
      timestamp: new Date().getTime()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving sensor reading:', error);
    throw error;
  }
};

export const getLatestReadings = async (limitCount: number = 10): Promise<SensorReading[]> => {
  try {
    const q = query(
      collection(db, 'sensorReadings'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SensorReading[];
  } catch (error) {
    console.error('Error getting latest readings:', error);
    throw error;
  }
}; 