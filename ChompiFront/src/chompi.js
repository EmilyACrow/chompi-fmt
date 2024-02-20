import './chompi.css';
import React, { useState } from 'react';


function DynamicSquare(props) {
    const {activeKey, onClick, value} = props;
    let className = props.keyType + "-key";
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

function Board(props) {
    const buttonColors = props.getButtonColors();
    const renderSquare = (idx, keyType) => {
        return (
            <DynamicSquare 
                value={idx}
                keyType={keyType}
                activeKey={props.activeKey}
                bank={props.bank}
                onClick={() => props.onClick(idx)}
                buttonColors={buttonColors}
                key={idx}
            />
        )
    }

    const renderWhiteKeys = () => {
        let row = Array(14).fill(null);
        for(let i = 0; i < 14; i++){
            row[i] = renderSquare(i, "white");
        }
        return row;
    }
  
    return (
        <div className="board">
            {renderWhiteKeys()}
        </div>
    );
}
  
function Chompi(props) {
    const {activeKey, setActiveKey, activeBank, setActiveBank, activeSampler, setActiveSampler} = props;
    const {getBankColors, currentSample} = props;

    const handleSampleKeyClick = (i) => {
        if (activeKey && i === activeKey) {
            setActiveKey(null);
        } else {
            setActiveKey(i);
            setActiveBank(i%3);
        }

    };

    return (
        <div className="chompi-container">
            <div className="chompi">
                <Board 
                    onClick={(i) => handleSampleKeyClick(i)}
                    getButtonColors={()=>getBankColors()}
                    activeKey={props.activeKey}
                    bank={props.activeBank}
                />
                <label>{currentSample}</label>
            </div>
        </div>
    );
}

export default Chompi;
  