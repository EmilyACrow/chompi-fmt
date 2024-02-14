import React, { useState, useEffect } from 'react';
import sampleLoader from './sampleLoader';

const Samples = () => {
    const [loadedFiles, setLoadedFiles] = useState([]);

    useEffect(() => {
        const loadFiles = async () => {
            const files = await sampleLoader.loadFiles();
            setLoadedFiles(files);
        };

        loadFiles();
    }, []);

    const handleButtonClick = async () => {
        const files = await sampleLoader.loadFiles();
        setLoadedFiles(prevLoadedFiles => [...prevLoadedFiles, ...files]);
    };

    return (
        <div>
            <button onClick={handleButtonClick}>{sampleLoader.createButton()}</button>
            <ul>
                {loadedFiles.map((file, index) => (
                    <li key={index}>{file}</li>
                ))}
            </ul>
        </div>
    );
};

export default Samples;
