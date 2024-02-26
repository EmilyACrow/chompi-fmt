import './chompi.css';
import { useState } from 'react';


function DynamicSquare(props) {
    const {isActive, onClick, value, className} = props;
    const { bankColor, bankHover, activeColor, activeHover } = props.buttonColors;
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    let divStyle
     
    if (isActive) {
        divStyle = {
            backgroundColor: isHovered ? activeHover : activeColor,
        }
    } else {
        divStyle= {
            backgroundColor: isHovered ? bankHover : bankColor,
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
            {value}
        </div>
    );
}

function SampleDisplay(props) {
    return (
        <div 
            className="sample-display"
        > {props.value} </div>
    )
}

function Board(props) {
    const buttonColors = props.getButtonColors(props.bank);
    const renderSampleSlot = (idx) => {
        return (
            <DynamicSquare 
                value={idx + 1}
                className="sample-slot"
                isActive={props.activeKey === idx}
                onClick={() => props.onSampleSlotClick(idx)}
                buttonColors={buttonColors}
                key={"slot" + idx}
            />
        )
    }

    const renderSampleSlots = () => {
        let row = Array(14).fill(null);
        for(let i = 0; i < 14; i++){
            row[i] = renderSampleSlot(i);
        }
        return row;
    }

    const renderBankButton = (idx) => {
        return (
            <DynamicSquare 
                value={"Bank " + String.fromCharCode(65 + idx)}
                className="bank-btn"
                isActive={props.bank === idx}
                onClick={() => props.onBankClick(idx)}
                buttonColors={props.getButtonColors(idx)}
                key={"bank" + idx}
            />
        )
    }

    const renderBankButtons = () => {
        let row = Array(3).fill(null);
        for(let i = 0; i < 3; i++){
            row[i] = renderBankButton(i);
        }
        return row;
    }

    const renderSamplerButtons = () => {
        let row = [];
        row.push(
            <DynamicSquare 
                value={"JAMMI"}
                className="sampler-btn"
                isActive={"jammi" === props.sampler}
                onClick={() => props.onSamplerClick("jammi")}
                buttonColors={props.getButtonColors(0)}
                key={"jammi"}
            />
        );
        row.push(
            <DynamicSquare 
                value={"CUBBI"}
                className="sampler-btn"
                isActive={"cubbi" === props.sampler}
                onClick={() => props.onSamplerClick("cubbi")}
                buttonColors={props.getButtonColors(0)}
                key={"cubbi"}
            />
        );
        return (row);
    }
  
    return (
        <div className="board">
            <div className="sampler-btn-container">
                {renderSamplerButtons()}
            </div>
            <div className="bank-btn-container">
                {renderBankButtons()}
            </div>
            <div className="sample-slot-container">
                {renderSampleSlots()}
            </div>
        </div>
    );
}
  
function Chompi(props) {
    const {activeKey, setActiveKey, activeBank, setActiveBank, activeSampler, setActiveSampler} = props;
    const {getBankColors, handleExport, handleImport, currentSample} = props;

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
                    getButtonColors={(i)=>getBankColors(i)}
                    activeKey={activeKey}
                    bank={activeBank}
                    sampler={activeSampler}
                />
                <SampleDisplay value={currentSample} />
            </div>
            <div className="import-export-container">
                <DynamicSquare
                    value={"IMPORT"}
                    className="import-export-btn"
                    onClick={()=>handleImport()}
                    buttonColors={getBankColors(0)}
                />                
                <div style={{flex: 1}}/>
                <DynamicSquare
                value={"EXPORT"}
                className="import-export-btn"
                onClick={()=>handleExport()}
                buttonColors={getBankColors(0)}
            />
            </div>

        </div>
    );
}

export default Chompi;
  