import React, { Component } from 'react';
import { PageHeader,Button,Grid, Row, Col,Table } from 'react-bootstrap';
//import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
//var LineChart = require("react-chartjs").Line;

//var server = "192.168.0.18";
var server = "athena.pi.slapps.fr";
const socket = io('http://'+server+':8080');
var url = "http://athena-loopback.pi.slapps.fr";

class App extends Component {
    constructor() {
        super();
        //var y = new Date();
        //y.setDate(y.getDate()-1);
        this.state = {
            temperatures: [],
            mouvements: [],
            serverStatus: false,
            date: new Date()
        };
        //fetch("http://athena-loopback.pi.slapps.fr/api/Temperatures")
        var currentDate = this.state.date;
        console.log("current:"+currentDate);
        var start = new Date(currentDate);
        //start.setDate(currentDate.getDate()-1);
        start.setHours(0,0,0,0);
        //TODO GOOD
        var s = start.toISOString();
        console.log("s:"+s);
        var end = new Date(currentDate);
        end.setHours(23,59,59,999);
        //TODO GOOD
        var e = end.toISOString();
        console.log("e:"+e);

        //TODO Chart
        //fetch(url+"/api/Temperatures?filter[where][and][0][at][gt]="+s+"&filter[where][and][1][at][lt]="+e)
        fetch(url+"/api/Temperatures?filter[limit]=10&filter[order]=id DESC")
            .then(result=>result.json())
            .then(t=>{
                console.log(t);
                this.setState({temperatures:t});
            });
        //fetch(url+"/api/Mouvements?filter[where][and][0][at][gt]="+s+"&filter[where][and][1][at][lt]="+e)
        fetch(url+"/api/Mouvements?filter[limit]=10&filter[order]=id DESC")
            .then(result=>result.json())
            .then(m=>{
                console.log(m);
                this.setState({mouvements:m});
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
    whiteStart(){
        socket.emit('white');
    }
    whiteStop(){
        socket.emit('stopWhite');
    }

    render() {
        var ts= this.state.temperatures;
        var ms= this.state.mouvements;
        if(ts.length==0||ms.length==0)
            return (<div>No data</div>);
        var lastT =  ts[ts.length-1];        
        var lastM =  ms[ms.length-1];        
        return (
                <div>
                <PageHeader>Athena</PageHeader>
                <p>Server Status : 
                <Button bsStyle={this.state.serverStatus?"success":"danger"}>{this.state.serverStatus?"Online":"KO"}
                </Button>
                </p>
                <Temp at={lastT.at} value={lastT.value}/>
                <Mouv at={lastM.at}/>
                <Button onClick={()=>this.blinkStart()}>Blink</Button>
                <Button onClick={()=>this.blinkStop()}>Stop Blink</Button>
                <br/>
                <Button onClick={()=>this.whiteStart()}>White</Button>
                <Button onClick={()=>this.whiteStop()}>Stop White</Button>
                <hr/>
                {
                //this.state.measures.map(m=>
                 //       <Measure type={m.type} at={m.at} value={m.value} key={m.id}/>
                 //       )
                 }
                </div>
               )
    }
}
/*
 * TODO Chart js react KO
class Chart extends Component {
    render(){
        var chartData = {
            labels:["A","B"],
            datasets:[{
                label: "1",
                data: [1,2]
            }, {
                label: "2",
                data: [3,4]
            }],
        };
        var chartOptions = {
            responsive:true,
            title:{
                display:true,
                text:"test"
            }
        };
        return <LineChart data={chartData} options={chartOptions} width="600" height="250"/>

    }
}
*/
class Temp extends Component {
    render(){
        return (
                <div>
                Last Temperature ({new Date(this.props.at).toLocaleString()}) : {this.props.value}°
                </div>
               )
    }
}
class Mouv extends Component {
    render(){
        return (
                <div>
                Last Mouvement : {new Date(this.props.at).toLocaleString()} 
                </div>
               )
    }
}
export default App;
