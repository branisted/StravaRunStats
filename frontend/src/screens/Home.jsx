import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import MyBarChart from '../components/MyBarChart.jsx';
import { useDropzone } from 'react-dropzone';

function Home() {
    const [data, setData] = useState([]); // Store fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [files, setFiles] = useState([]);
    const [globalDragActive, setGlobalDragActive] = useState(false);

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

        let dragCounter = 0;

        const handleDragEnter = (e) => {
            e.preventDefault();
            dragCounter++;
            setGlobalDragActive(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            dragCounter--;
            if (dragCounter === 0) setGlobalDragActive(false);
        };

        const handleDrop = (e) => {
            dragCounter = 0;
            setGlobalDragActive(false);
        };

        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('drop', handleDrop);
        };

    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Full screen overlay when dragging files */}
            {isDragActive && (
                <div
                    style={{
                        position: 'fixed',
                        zIndex: 9999,
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(50, 50, 50, 0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '2.5rem',
                        pointerEvents: 'none', // Allow drop events to pass through
                        transition: 'background 0.2s'
                    }}
                >
                    <div>
                        <p>Drop the files anywhere to upload...</p>
                    </div>
                </div>
            )}

            <h1 align="center">StravaRunStats</h1>

            {/* Always show the dropzone */}
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #888',
                    margin: '0 auto',
                    width: '60%',
                    padding: '20px',
                    textAlign: 'center',
                    borderRadius: '10px',
                    background: isDragActive ? '#eee' : '#fff',
                    marginBottom: '2rem',
                    transition: 'background 0.2s'
                }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p style={{ fontWeight: 'bold', color: '#444' }}>Drop the files here ...</p>
                ) : (
                    <p>Drag & drop files here, or click to select files</p>
                )}
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {files.map(file => (
                        <li key={file.name}>
                            {file.name} - {(file.size / 1024).toFixed(2)} KB
                        </li>
                    ))}
                </ul>
            </div>

            {/* Conditionally show chart or message */}
            {data && data.length > 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <MyBarChart data={data} />
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