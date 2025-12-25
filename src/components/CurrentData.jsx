import React, { useState, useEffect } from 'react'

const CurrentData = () => {
    const [data, setData] = useState(null); 

    useEffect(() => {
        fetch('http://localhost:4000/api/currentdata')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);
  return (
    <div>
        {data ? (
            <div className="p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Current Water Level Data</h2>
                <p>Water Level: {data.waterLevel}</p>
                <p>Timestamp: {data.timestamp}</p>
            </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>
  )
}

export default CurrentData