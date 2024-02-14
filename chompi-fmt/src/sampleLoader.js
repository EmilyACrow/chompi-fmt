import React, { useState } from 'react';

const SampleLoader = ({ onFilesLoaded }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileSelect = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = '.wav';

        fileInput.addEventListener('change', () => {
            setSelectedFiles(Array.from(fileInput.files));
            onFilesLoaded(Array.from(fileInput.files));
        });

        fileInput.click();
    };

    return (
        <div onClick={handleFileSelect}>
            Load Samples
        </div>
    );
};

export default SampleLoader;
