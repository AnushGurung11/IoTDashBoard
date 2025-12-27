import React, { useState, useEffect } from 'react';
import { Droplets, Clock, AlertCircle, Waves } from 'lucide-react';

const CurrentData = () => {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/currentdata');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                setData(result);
                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 text-lg font-medium">Loading data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="flex items-center space-x-3 text-red-600 mb-4">
                        <AlertCircle size={32} />
                        <h2 className="text-2xl font-bold">Connection Error</h2>
                    </div>
                    <p className="text-gray-700 mb-2">{error}</p>
                    <p className="text-sm text-gray-500">Please check if the server is running.</p>
                </div>
            </div>
        );
    }

    const isBridgeOpen = data.servoStatus === 'OFF';
    
    const getFloodStatus = () => {
        if (data.waterLevel < 80) {
            return { level: 'Safe', color: 'from-green-500 to-green-600', badge: 'bg-green-500', text: 'Safe - No flood risk' };
        } else if (data.waterLevel >= 80 && data.waterLevel <= 90) {
            return { level: 'Moderate Risk', color: 'from-yellow-500 to-orange-500', badge: 'bg-yellow-500', text: 'Moderate risk of flood' };
        } else {
            return { level: 'Danger', color: 'from-red-500 to-red-600', badge: 'bg-red-500', text: 'High risk of flood - Danger' };
        }
    };
    
    const floodStatus = getFloodStatus();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Water Level Monitor</h1>
                    <p className="text-gray-600">Real-time monitoring system</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className={`p-8 bg-gradient-to-br ${floodStatus.color} text-white`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <Droplets size={32} />
                                <h2 className="text-2xl font-bold">Water Level</h2>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${floodStatus.badge}`}>
                                {floodStatus.level}
                            </div>
                        </div>
                        
                        <div className="text-6xl font-bold mb-2">{data.waterLevel}<span className="text-3xl">cm</span></div>
                        <p className="text-lg text-white text-opacity-90">{floodStatus.text}</p>
                    </div>

                    <div className="p-8 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Waves size={28} className="text-gray-700" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Bridge Status</h3>
                                    <p className="text-sm text-gray-500">Current position</p>
                                </div>
                            </div>
                            <div className={`px-6 py-3 rounded-xl text-lg font-bold ${
                                isBridgeOpen 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {isBridgeOpen ? 'Open' : 'Closed'}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50">
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                            <Clock size={18} />
                            <span className="text-sm">Last updated: {new Date(data.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-md p-4 text-center">
                        <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                            data.waterLevel < 80 ? 'bg-green-500' : data.waterLevel <= 90 ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-pulse'
                        }`}></div>
                        <p className="text-sm text-gray-600">Flood Alert</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4 text-center">
                        <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                            isBridgeOpen ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <p className="text-sm text-gray-600">Bridge Control</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentData;