import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import MyBarChart from '../components/MyBarChart.jsx';
import { useDropzone } from 'react-dropzone';

function Home() {
    const [data, setData] = useState([]); // Store fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [files, setFiles] = useState([]);

    // The function to process a single file through all endpoints
    async function processFile(file) {
        try {
            // 1. Upload the file
            const formData = new FormData();
            formData.append('file', file); // 'files' is the field name; adjust if your backend expects something else

            const uploadRes = await axios.post('http://127.0.0.1:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const uploadedFilePath = uploadRes.data.file_path;

            // 2. Extract data from the uploaded file
            const extractRes = await axios.post('http://127.0.0.1:8000/extract', {
                file_name: uploadedFilePath // or whatever your backend expects
            });
            const extractedData = extractRes.data;

            // 3. Save the extracted data
            const saveRes = await axios.post('http://127.0.0.1:8000/save', extractedData);

            // Return the saved data or whatever your API returns
            return saveRes.data;
        } catch (err) {
            console.error("Error processing file:", err);
            throw err;
        }
    }

    // Updated onDrop: process each file through the API chain
    const onDrop = useCallback(async (acceptedFiles) => {
        setFiles(acceptedFiles);
        setLoading(true);
        setError(null);

        try {
            // If you want to process files one by one and collect results:
            const results = [];
            for (const file of acceptedFiles) {
                const result = await processFile(file);
                results.push(result);
            }
            // Optionally, you can fetch the updated data from your backend
            const response = await axios.get("http://127.0.0.1:8000/data");
            setData(response.data);
        } catch (err) {
            setError(err.message || "Error processing file");
        }
        setLoading(false);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/data")
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Error fetching data");
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 align="center">StravaRunStats</h1>
            {/* Always show the dropzone */}
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #888',
                    margin: '0 auto',
                    width: '48%',
                    padding: '20px',
                    textAlign: 'center',
                    borderRadius: '10px',
                    background: isDragActive ? '#eee' : '#fff',
                    marginBottom: '2rem'
                }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag & drop files here, or click to select files</p>
                )}
                <ul>
                    {files.map(file => (
                        <li key={file.name}>
                            {file.name} - {(file.size / 1024).toFixed(2)} KB
                        </li>
                    ))}
                </ul>
            </div>

            {/* Conditionally show chart or message */}
            {data && data.length > 0 ? (
                <div align="center">
                    <MyBarChart data={data}/>
                </div>
            ) : (
                <h1 align="center">
                    Add some runs to see some data by drag and dropping them here.
                </h1>
            )}
        </div>
    );
}

export default Home;