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
        return (Math.floor((minutes + seconds / 60) * 100) / 100).toFixed(2)
    }

    function paceStringToMinutes(paceStr) {
        if (!paceStr) return 0;
        const match = paceStr.match(/(\d+):(\d+)\/km/);
        if (!match) return 0;
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        return (Math.floor((minutes + seconds / 60) * 100) / 100).toFixed(2)
    }

    // Convert the time string to a number for each item
    const processedData = data.map(item => ({
        ...item,
        time: timeStringToMinutes(item.time),
        pace: paceStringToMinutes(item.pace)
    }));

    return (
        <ResponsiveContainer width="60%" height={300}>
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
    );
};

export default MyBarChart;