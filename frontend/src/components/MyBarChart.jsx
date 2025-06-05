import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, BarChart, Bar
} from 'recharts';

const MyBarChart = ({ data }) => {
    // Conversion function (put this outside or above the component if reused)
    function timeStringToMinutes(timeStr) {
        if (!timeStr) return 0;
        const match = timeStr.match(/(\d+)m(\d+)s/);
        if (!match) return 0;
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        return (Math.floor((minutes + seconds / 60) * 100) / 100)
    }

    function paceStringToMinutes(paceStr) {
        if (!paceStr) return 0;
        const match = paceStr.match(/(\d+):(\d+)\/km/);
        if (!match) return 0;
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        return (Math.floor((minutes + seconds / 60) * 100) / 100)
    }

    function distanceStringToKM(distanceStr) {
        if (!distanceStr) return 0;
        const match = distanceStr.match(/(\d+).(\d+)km/);
        if (!match) return 0;
        const km = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        return (Math.floor((km + m * 10 / 1000) * 100) / 100)
    }

    // Convert the time string to a number for each item
    const processedData = data.map(item => ({
        ...item,
        distance: distanceStringToKM(item.distance),
        time: timeStringToMinutes(item.time),
        pace: paceStringToMinutes(item.pace)
    }));

    return (
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Time & Pace Over Date</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" label={{ value: 'Time (min)', angle: -90 }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Pace (min/km)', angle: -90 }} />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="time"
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="pace"
                            stroke="#82ca9d"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Distance Over Date</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'Distance (km)', angle: -90 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="distance" fill="#A7C1A8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

};

export default MyBarChart;