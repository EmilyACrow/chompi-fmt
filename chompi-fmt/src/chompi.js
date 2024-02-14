import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button 
            className={props.keyType + "-key"}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i,keyType) {
      return (
            <Square 
                value={this.props.samples[i]}
                keyType={keyType}
                onClick={() => this.props.onClick(i)}
            />
        )
    }
    renderWhiteKeys() {
        let row=Array(14).fill(null);
        for(let i=0; i<14; i++){
            row[i]=this.renderSquare(i,"white");
        }
    }
  
    render() {
        return (
            <div>
                <div className="sample-row">
                    {this.renderWhiteKeys()}
                </div>
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
            currentBank: 0,
            currentSampler: "jammi",
            initialBanks: this.getInitialBanks(),
            activeKey: null
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
        const banks = current.banks.slice();

        banks[i] = this.state.currentBank;
        this.setState({
        })
    }

    resetBank(sampler,bank) {
        let m_banks = this.state.banks.slice();
        m_banks[sampler[bank]] = 
            this.state.initialBanks[sampler[bank]];

        this.setState({
            banks: banks,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {    

        return (
            <div className="chompi">
            <div className="chompi-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            </div>
        );
    }
}
  