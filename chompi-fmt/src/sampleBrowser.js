import React, { useState } from 'react';
import './sampleBrowser.css';

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
            {value + 1}
        </div>
    );
}

function SampleBrowser(props) {
    const [samples, setSamples] = useState(Array(2).fill(null));
    const {currentSample, setCurrentSample} = props;
    const { getButtonColors, activeBank, activeKey } = props;

    const handleClick = (i) => {
        setCurrentSample(samples[i]);
    };

    const renderSampleCard = (i) => {
        return (
            <SampleCard
                value={i}
                onClick={() => handleClick(i)}
                buttonColors={getButtonColors()}
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
            {renderSampleCards()}
        </div>
    );
}

export default SampleBrowser;