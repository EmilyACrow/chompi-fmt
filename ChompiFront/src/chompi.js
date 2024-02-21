import './chompi.css';
import React, { useState } from 'react';


function SampleSlot(props) {
    const {activeKey, onClick, value} = props;
    const className = "sample-slot";
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
    const renderSampleSlot = (idx) => {
        return (
            <SampleSlot 
                value={idx}
                activeKey={props.activeKey}
                bank={props.bank}
                onClick={() => props.onSampleSlotClick(idx)}
                buttonColors={buttonColors}
                key={idx}
            />
        )
    }

    const renderBankButton = (idx) => {
        return (
            <button 
                className="bank-btn"
                onClick={() => props.onBankClick(idx)}
            >
                {"Bank " + (idx + 1)}
            </button>
        )
    }

    const renderSampleSlots = () => {
        let row = Array(14).fill(null);
        for(let i = 0; i < 14; i++){
            row[i] = renderSampleSlot(i);
        }
        return row;
    }

    const renderBankButtons = () => {
        let row = Array(3).fill(null);
        for(let i = 0; i < 3; i++){
            row[i] = renderBankButton(i);
        }
        return row;
    }

    const renderSamplerButtons = () => {
        let row = Array(2).fill(null);
        row[0] = (
            <button 
                className="sampler-btn"
                onClick={() => props.onSamplerClick("jammi")}
            >
                Jammi
            </button>
        );
        row[1] = (
            <button 
                className="sampler-btn"
                onClick={() => props.onSamplerClick("cubbi")}
            >
                Cubbi
            </button>
        );
        return (row);
    }
  
    return (
        <div className="board">
            <div className="sampler-btns">
                {renderSamplerButtons()}
            </div>
            <div className="bank-btns">
                {renderBankButtons()}
            </div>
            <div className="sample-slots">
                {renderSampleSlots()}
            </div>
        </div>
    );
}
  
function Chompi(props) {
    const {activeKey, setActiveKey, activeBank, setActiveBank, activeSampler, setActiveSampler} = props;
    const {getBankColors, currentSample} = props;

    const handleSampleKeyClick = (i) => {
        setActiveKey(i);
    };

    return (
        <div className="chompi-container">
            <div className="chompi">
                <Board 
                    onSampleSlotClick={(i) => handleSampleKeyClick(i)}
                    onBankClick={(i) => setActiveBank(i)}
                    onSamplerClick={(sampler) => setActiveSampler(sampler)}
                    getButtonColors={()=>getBankColors()}
                    activeKey={activeKey}
                    bank={activeBank}
                />
                <label>{currentSample}</label>
            </div>
        </div>
    );
}

export default Chompi;
  