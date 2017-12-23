import React, { Component } from 'react';
import { Button,Grid, Row, Col,Table } from 'react-bootstrap';
//import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
const socket = io('http://pi.slapps.fr:8080');


class App extends Component {
    constructor() {
        super();
        //var y = new Date();
        //y.setDate(y.getDate()-1);
        this.state = {
            measure: Measure,
            measures: [],
            serverStatus: false,
        };
        //fetch("http://athena-loopback.pi.slapps.fr/api/Temperature")
        fetch("http://pi.slapps.fr:3000/api/measures")
            .then(result=>result.json())
            .then(measures=>{
                console.log(measures);
                this.setState({measures:measures});
                this.setState({measure:measures[measures.length-1]});
            });
        socket.on('status', (status) => {
            console.log("status",status);
            this.setState({serverStatus : status});
        });

    } 
    blinkStart(){
        socket.emit('blink');
    }
    blinkStop(){
        socket.emit('stopBlink');
    }
    render() {
        var current = this.state.measure;
        return (
                <div>
                <h1>Athena 
                <Button bsStyle={this.state.serverStatus?"success":"danger"}>{this.state.serverStatus?"Online":"KO"}
                </Button></h1>
                <Measure type={current.type} at={current.at} value={current.value} key={current.id}/>
                <Button onClick={()=>this.blinkStart()}>Blink</Button>
                <Button onClick={()=>this.blinkStop()}>Stop Blink</Button>
                <hr/>
                {this.state.measures.map(m=>
                        <Measure type={m.type} at={m.at} value={m.value} key={m.id}/>
                        )}
                </div>
               )
    }
}
class Measure extends Component {
    render(){
        return (
                <div>
                {this.props.type} ({new Date(this.props.at).toLocaleString()}) : {this.props.value}°
                </div>
               )
    }
}
export default App;
