import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react';

const Chart = () => {
    const [data, setData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/alldata');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Sort data by date (oldest first) and format for chart
                const formattedData = result
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                    .map(item => ({
                        time: new Date(item.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        waterLevel: item.waterLevel,
                        servoStatus: item.servoStatus,
                        fullDate: new Date(item.createdAt).toLocaleString()
                    }));
                
                setData(formattedData);
                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
        
        return () => clearInterval(interval);
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const riskLevel = data.waterLevel < 10 ? 'High Risk' : data.waterLevel <= 15 ? 'Moderate Risk' : 'Safe';
            const riskColor = data.waterLevel < 10 ? 'text-red-600' : data.waterLevel <= 15 ? 'text-yellow-600' : 'text-green-600';
            
            return (
                <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">{data.fullDate}</p>
                    <p className="text-lg font-bold text-blue-600 mb-1">
                        Water Level: {data.waterLevel} cm
                    </p>
                    <p className={`text-sm font-semibold ${riskColor}`}>
                        {riskLevel}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Bridge: {data.servoStatus === 'OFF' ? 'Open' : 'Closed'}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 text-lg font-medium">Loading chart data...</p>
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

    const latestReading = data[data.length - 1];
    const highestLevel = Math.max(...data.map(d => d.waterLevel));
    const lowestLevel = Math.min(...data.map(d => d.waterLevel));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                        <TrendingUp size={40} className="text-blue-600" />
                        Water Level History
                    </h1>
                    <p className="text-gray-600">Historical water level monitoring data</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-sm text-gray-500 mb-1">Current Level</p>
                        <p className="text-3xl font-bold text-blue-600">{latestReading?.waterLevel} cm</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-sm text-gray-500 mb-1">Highest Recorded</p>
                        <p className="text-3xl font-bold text-red-600">{highestLevel} cm</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-sm text-gray-500 mb-1">Lowest Recorded</p>
                        <p className="text-3xl font-bold text-green-600">{lowestLevel} cm</p>
                    </div>
                </div>

                {/* Main Chart */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Water Level Over Time</h2>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={20} />
                            <span className="text-sm">{data.length} readings</span>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorWaterLevel" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="time" 
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis 
                                label={{ value: 'Water Level (cm)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                                tick={{ fill: '#6b7280' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="waterLevel" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorWaterLevel)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Risk Level Indicators */}
                    <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <span className="text-gray-600">High Risk (&lt; 10cm)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                            <span className="text-gray-600">Moderate Risk (10-15cm)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span className="text-gray-600">Safe (&gt; 15cm)</span>
                        </div>
                    </div>
                </div>

                {/* Recent Readings Table */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Readings</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date & Time</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Water Level</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Risk Status</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Bridge Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(-10).reverse().map((item, index) => {
                                    const riskLevel = item.waterLevel < 10 ? 'High Risk' : item.waterLevel <= 15 ? 'Moderate Risk' : 'Safe';
                                    const riskColor = item.waterLevel < 10 ? 'bg-red-100 text-red-700' : item.waterLevel <= 15 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
                                    
                                    return (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-700">{item.fullDate}</td>
                                            <td className="py-3 px-4 text-gray-900 font-semibold">{item.waterLevel} cm</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskColor}`}>
                                                    {riskLevel}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    item.servoStatus === 'OFF' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {item.servoStatus === 'OFF' ? 'Open' : 'Closed'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chart;