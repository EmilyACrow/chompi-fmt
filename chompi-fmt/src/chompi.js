import React from 'react';
import './chompi.css';
import SampleBrowser from './sampleBrowser';


function DynamicSquare(props) {
    const {activeKey, onClick, value} = props;
    let className = props.keyType + "-key";
    const { backgroundColor, hoverColor } = getButtonColors(props.bank);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    let divStyle = {
        backgroundColor: isHovered ? hoverColor : backgroundColor,
    };

    if (value === activeKey) {
        divStyle = {
            backgroundColor: isHovered ? "#ccc" : "#fff"
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

function Square(props) {
    const className = props.keyType + "-key";
    // const bankColor = props.bankColor;
    // const bankHoverColor = props.bankHoverColor;
    // const activeColor = props.activeColor;
    // const activeKey = props.activeKey;
    // let bgColor = prop.value === activeKey ? activeColor : bankColor;
    return (
        <button 
            className={className}
            onClick={props.onClick}
            style={{backgroundColor:"#444"}}
        >
            {props.value + 1}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(props) {
        const idx = props.idx;
        return (
            <DynamicSquare 
                value={idx}
                keyType={props.keyType}
                bank={this.props.bank}
                activeKey={this.props.activeKey}
                onClick={() => this.props.onClick(idx)}
                key={idx}
            />
        )
    }

    renderWhiteKeys() {
        let row=Array(14).fill(null);
        for(let i=0; i<14; i++){
            row[i]=this.renderSquare({idx: i, keyType: "white"});
        }
        return row;
    }
  
    render() {
        return (
            <div className="board">
                {this.renderWhiteKeys()}
            </div>
        );
    }
}
  
class Chompi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            banks:  {
                jammi: Array(3).fill(Array(14).fill("jammi")),
                cubbi: Array(3).fill(Array(14).fill("cubbi")),
            },
            samples: props.loadedSamples,
            currentBank: 0,
            currentSampler: "jammi",
            initialBanks: this.getInitialBanks(),
            selectedSample: null,
            activeKey: props.activeKey,
        }
    }

    /* TODO: populate from filesystem */
    getInitialBanks() { // 3 banks of 14 keys
        return {
            jammi: Array(3).fill(Array(14).fill(null)),
            cubbi: Array(3).fill(Array(14).fill(null)),
        }
    }

    handleSampleKeyClick(i) {
        const samples = this.state.samples.slice();
        let key = samples[i];
        if (this.state.activeKey && key === this.state.activeKey) {
            this.setState({
                activeKey: null,
                selectedSample: null,
            })
        } else {
            console.log(this.state.banks[this.state.currentSampler][this.state.currentBank])
            this.setState({
                activeKey: i,
                selectedSample: this.state.banks[this.state.currentSampler][this.state.currentBank][i],
                currentBank: i % 3,
            })
        }
        
    }

    resetBank(sampler,bank) {
        let banks = this.state.banks.slice();
        banks[sampler[bank]] = 
            this.state.initialBanks[sampler[bank]];

        this.setState({
            banks: banks,
        })
    }

    render() {
        let activeSample = this.state.selectedSample;

        return (
            <div className="chompi-container">
                <div className="chompi">
                    <Board 
                        onClick = {i => this.handleSampleKeyClick(i)}
                        keys = {this.state.keys}
                        activeKey = {this.state.activeKey}
                        bank = {this.state.currentBank}
                    />
                    <label>{activeSample}</label>
                </div>
            </div>
        );
    }
}

function getButtonColors(bank) {
    let bgColor, hoverColor;
    switch(bank) {
        case 1:
            bgColor = "#F6C95E";
            hoverColor = "#CEA136";
            break;
        case 2:
            bgColor = "#64BDCA";
            hoverColor = "#3C95A2";
            break;
        default:
            bgColor = "#A794C2";
            hoverColor = "#7F6C9A";
    }
    return {
        backgroundColor: bgColor,
        hoverColor: hoverColor,
    }
}

export default Chompi;
  