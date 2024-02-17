import React from 'react';
import './sampleBrowser.css';
import './chompi.css';

function SampleCard(props) {
    const {onClick, value} = props;
    const className = "sample-card";
    //const { backgroundColor, hoverColor } = getButtonColors(props.bank);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    // let divStyle = {
    //     backgroundColor: isHovered ? hoverColor : backgroundColor,
    // };

    // if (value === activeKey) {
    //     divStyle = {
    //         backgroundColor: isHovered ? "#ccc" : "#fff"
    //     }
    // }
    let divStyle = {
        backgroundColor: isHovered ? "#ccc" : "#fff"
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

class SampleBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            samples: Array(2).fill("test"),
            loadedSamples: Array(14).fill(null),
            
        };
    }

    renderSampleCard(i) {
        return (
            <SampleCard
                value={i}
                onClick={() => this.handleClick(i)}
                key={i}
            />
        );
    }

    renderSampleCards() {
        let samples=this.state.samples;
        for(let i=0; i<samples.length; i++){
            samples[i]=this.renderSampleCard(i);
        }
        return samples;
    }

    handleClick(i) {
        this.setState({
            activeSample: this.state.samples[i],
        });
    }

    render() {
        return (
            <div className="sample-browser">
                {this.renderSampleCards()}
            </div>
        );
    }
}

export default SampleBrowser;