// Create and handle the sample browser

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/fontawesome-free-regular'
import './sampleBrowser.css';


function FileBrowserButton(props) {
    const { onFileChange } = props;
    const inputFile = useRef(null);

    const handleFileChange = (event) => {
        const files = event.target.files;
        const validFiles = Array.from(files).filter((file) =>
            file.name.endsWith('.wav')
        );

        return onFileChange(validFiles);
    };

    const handleClick = () => {
        inputFile.current.click();
    }

    return (
        <div 
            className="load-sample-btn" 
            onClick={handleClick}>
            <input
                type="file"
                accept=".wav"
                multiple
                ref={inputFile}
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
            Import Samples
        </div>
    );
}

function NameCard(props) {
    const {value, onClick, current, bank } = props;
    const { bankColor, bankHover, activeColor, activeHover } = props.buttonColors;
    const [isHovered, setIsHovered] = useState(false);
    const className = "name-card";
    const defaultColor = "#fff";
    const defaultHover = "#ddd";

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    let divStyle;

    if (value === current) {
        divStyle = {
            backgroundColor: isHovered ? activeHover : activeColor,
        };
    } else if (bank.includes(value)) {
        divStyle = {
            backgroundColor: isHovered ? bankHover : bankColor,
        };
    } else {
        divStyle = {
            backgroundColor: isHovered ? defaultHover : defaultColor,
        };
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

function DeleteCard(props) {
    return (
        <div 
            className="delete-card"
            onClick={props.onClick}>
            <FontAwesomeIcon icon={faTrashAlt} />
        </div>
    )
}

function SampleCard(props) {
    const {currentSample, onSampleClick, onDeleteSampleClick, value, bank} = props;
    const className = "sample-card";

    return (
        <div className={className}>
            <NameCard
                onClick={onSampleClick}
                bank={bank}
                value={value}
                current={currentSample}
                buttonColors={props.buttonColors}
            />
            <DeleteCard 
                onClick={onDeleteSampleClick}
                value={value}
            />
        </div>
    );
}

function SampleBrowser(props) {
    const {currentSample, onSampleClick, onDeleteSampleClick, samples, loadSamples, bank} = props;
    const { getBankColors } = props;

    const handleSampleClick = (i) => {
        onSampleClick(i);
    };

    const handleDeleteSampleClick = (i) => {
        onDeleteSampleClick(i);
    }

    const handleFileImportClick = (files) => {
        loadSamples([...files]);
    }

    const renderSampleCard = (i) => {
        return (
            <SampleCard
                value={i}
                onSampleClick={() => handleSampleClick(i)}
                onDeleteSampleClick={() => handleDeleteSampleClick(i)}
                buttonColors={getBankColors()}
                currentSample={currentSample}
                bank={bank}
                key={i}
            />
        );
    };

    const renderSampleCards = () => {
        let renderedSamples = samples.map((i) => {
            return renderSampleCard(i);
        });
        return renderedSamples;
    };

    return (
        <div className="sample-browser">
            <div className="file-browser-btn">
                <FileBrowserButton onFileChange={handleFileImportClick} />
            </div>
            <div className='samples-container'>
                {renderSampleCards()}
            </div>
            
        </div>
    );
}

export default SampleBrowser;