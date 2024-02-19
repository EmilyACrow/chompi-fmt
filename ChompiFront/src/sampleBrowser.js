import React, { useState } from 'react';
import './sampleBrowser.css';


function FileBrowserButton(props) {
    const { onFileChange } = props;

    const handleFileChange = (event) => {
        const files = event.target.files;
        const validFiles = Array.from(files).filter((file) =>
            file.name.endsWith('.wav')
        );

        return onFileChange(validFiles);
    };

    return (
        <div className="load-sample-btn">
            <input
                type="file"
                accept=".wav"
                multiple
                onChange={handleFileChange}
            />
        </div>
    );
}



function SampleCard(props) {
    const {activeKey, onClick, value} = props;
    let className = "sample-card";
    const { bankColor, bankHover, activeColor, activeHover } = props.buttonColors;
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    let divStyle = {
        backgroundColor: isHovered ? bankHover : bankColor,
    };
    if (value === activeKey) {
        divStyle = {
            backgroundColor: isHovered ? activeHover : activeColor,
        }
    }

    return (
        <div
            className={className}
            style={divStyle}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {value.slice(0,-4)} 
        </div>
    );
}

function SampleBrowser(props) {
    const {currentSample, setCurrentSample, samples, setSamples} = props;
    const { getBankColors } = props;

    const handleSampleClick = (i) => {
        setCurrentSample(samples[i]);
    };

    const handleFileImportClick = (files) => {
        setSamples([...samples, ...files]);
    }

    const renderSampleCard = (i) => {
        return (
            <SampleCard
                value={samples[i].name}
                onClick={() => handleSampleClick(i)}
                buttonColors={getBankColors()}
                key={i}
            />
        );
    };

    const renderSampleCards = () => {
        let renderedSamples = samples.map((sample, i) => {
            return renderSampleCard(i);
        });
        return renderedSamples;
    };

    return (
        <div className="sample-browser">
            <div className="file-browser-btn">
                <FileBrowserButton onFileChange={handleFileImportClick} />
            </div>
            {renderSampleCards()}
        </div>
    );
}

export default SampleBrowser;