import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import MyBarChart from '../components/MyBarChart.jsx';
import { useDropzone } from 'react-dropzone';

const BASE_URL = "http://127.0.0.1:8000";
const API = {
    upload: `${BASE_URL}/upload`,
    extract: `${BASE_URL}/extract`,
    save: `${BASE_URL}/save`,
    data: `${BASE_URL}/data`,
};

// Custom hook for handling global drag overlay
function useGlobalDrag(setDragActive) {
    useEffect(() => {
        let dragCounter = 0;

        const handleDragEnter = (e) => {
            e.preventDefault();
            dragCounter++;
            setDragActive(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            dragCounter--;
            if (dragCounter === 0) setDragActive(false);
        };

        const handleDrop = () => {
            dragCounter = 0;
            setDragActive(false);
        };

        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('drop', handleDrop);
        };
    }, [setDragActive]);
}

function Home() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [globalDragActive, setGlobalDragActive] = useState(false);

    useGlobalDrag(setGlobalDragActive);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(API.data);
            setData(data);
        } catch (err) {
            setError(err.message || "Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    const processFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data: uploadData } = await axios.post(API.upload, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { data: extractedData } = await axios.post(API.extract, {
                file_name: uploadData.file_path,
            });

            const { data: savedData } = await axios.post(API.save, extractedData);
            return savedData;
        } catch (err) {
            console.error("Error processing file:", err);
            throw err;
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        setFiles(acceptedFiles);
        setLoading(true);
        setError(null);

        try {
            for (const file of acceptedFiles) {
                await processFile(file);
            }
            await fetchData();
        } catch (err) {
            setError(err.message || "Error processing file");
            setLoading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
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
                        pointerEvents: 'none',
                        transition: 'background 0.2s',
                    }}
                >
                    <p>Drop the files anywhere to upload...</p>
                </div>
            )}

            <h1 align="center">StravaRunStats</h1>

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
                    transition: 'background 0.2s',
                }}
            >
                <input {...getInputProps()} />
                <p>{isDragActive ? "Drop the files here ..." : "Drag & drop files here, or click to select files"}</p>

                {files.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {files.map(file => (
                            <li key={file.name}>
                                {file.name} - {(file.size / 1024).toFixed(2)} KB
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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