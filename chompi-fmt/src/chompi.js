import React from 'react';
import './chompi.css';

function Square(props) {
    let className = props.keyType + "-key";
    return (
        <button 
            className={className}
            onClick={props.onClick}
        >
            {props.value + 1}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i,keyType) {
        return (
            <Square 
                value={this.props.keys[i]}
                keyType={keyType}
                onClick={() => this.props.onClick(i)}
                key={i}
            />
        )
    }

    renderWhiteKeys() {
        let row=Array(14).fill(null);
        for(let i=0; i<14; i++){
            console.log(i)
            row[i]=this.renderSquare({i: i, keyType: "white"});
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
            banks: [{
                jammi: Array(3).fill(Array(14).fill(null)),
                cubbi: Array(3).fill(Array(14).fill(null)),
            }],
            keys: Array(14).fill(null),
            currentBank: 0,
            currentSampler: "jammi",
            initialBanks: this.getInitialBanks(),
            activeKey: null,
            selectedSample: null,
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
        const keys = this.state.keys.slice();
        let key = keys[i];
        if (this.state.activeKey && key === this.state.activeKey) {
            this.setState({
                activeKey: null,
                selectedSample: null,
            })
        } else {
            this.setState({
                activeKey: key,
                selectedSample: this.state.banks[this.state.currentSampler][this.state.currentBank][key],
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

        return (
            <div className="chompi">
                <Board 
                    onClick = {i => this.handleSampleKeyClick(i)}
                    keys = {this.state.keys}
                />
            </div>
        );
    }
}

export default Chompi;
  