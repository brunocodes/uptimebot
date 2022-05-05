import React from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import { Line, defaults } from 'react-chartjs-2';
import EventLogs from './EventLogs';

defaults.global.defaultFontColor = 'white';
defaults.global.defaultFontSize = 15;
class MonitorData extends React.Component {

    state = {
        chartData: {},
        currentButton: true,
        labelsArray: [],
        option: {}
    }
    componentDidMount() {
        this.getChartData()
    }

    getChartData = ()=> {
        try {
            const myEvent = {
                event_id: this.props.currentMonitor.eventID
            };
            fetch("http://localhost:5050/app/pingdata", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: myEvent
                })
            })
            .then(res=> {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events") 
                }                
            }).then(res=> {
                console.log(res.ping_data);
                const labelsArrayBlank = [];
                const labelsArray = [];
                const dataArray = [];
                res.ping_data.forEach(ping=> {
                    labelsArrayBlank.push(""); // ping.date
                    const newTime = new Date(ping.date).toLocaleTimeString();
                    labelsArray.push(newTime);
                    dataArray.push(ping.res_time);
                })
                if (labelsArray.length && dataArray.length > 0 ) {
                    this.setState({
                        labelsArray: labelsArray,
                        chartData: {
                        labels: labelsArrayBlank,
                        datasets: [{
                            label: 'Milliseconds',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: dataArray }] 
                        }
                    });
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    getChartData2H = ()=> {
        if(this.state.currentButton) this.setState({currentButton: false});
        try {
            const myEvent = {
                event_id: this.props.currentMonitor.eventID
            };
            fetch("http://localhost:5050/app/pingdata2", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: myEvent
                })
            })
            .then(res=> {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events") 
                }                
            }).then(res=> {
                console.log(res.ping_data);
                const labelsArrayBlank = [];
                const labelsArray = [];
                const dataArray = [];
                res.ping_data.forEach(ping=> {
                    labelsArrayBlank.push(""); // ping.date
                    const newTime = new Date(ping.date).toLocaleTimeString();
                    labelsArray.push(newTime);
                    dataArray.push(ping.res_time);
                })
                if (labelsArray.length && dataArray.length > 0 ) {
                    this.setState({
                        labelsArray: labelsArray,
                        chartData: {
                        labels: labelsArrayBlank,
                        datasets: [{
                            label: 'Milliseconds',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: dataArray }] 
                        }
                    });
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    getChartData3H = ()=> {
        if(this.state.currentButton) this.setState({currentButton: false});
        try {
            const myEvent = {
                event_id: this.props.currentMonitor.eventID
            };
            fetch("http://localhost:5050/app/pingdata3", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: myEvent
                })
            })
            .then(res=> {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events") 
                }                
            }).then(res=> {
                console.log(res.ping_data);
                const labelsArrayBlank = [];
                const labelsArray = [];
                const dataArray = [];
                res.ping_data.forEach(ping=> {
                    labelsArrayBlank.push(""); // ping.date
                    const newTime = new Date(ping.date).toLocaleTimeString();
                    labelsArray.push(newTime);
                    dataArray.push(ping.res_time);
                })
                if (labelsArray.length && dataArray.length > 0 ) {
                    this.setState({
                        labelsArray: labelsArray,
                        chartData: {
                        labels: labelsArrayBlank,
                        datasets: [{
                            label: 'Milliseconds',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: dataArray }] 
                        }
                    });
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    getChartData6H = ()=> {
        if(this.state.currentButton) this.setState({currentButton: false});
        try {
            const myEvent = {
                event_id: this.props.currentMonitor.eventID
            };
            fetch("http://localhost:5050/app/pingdata6", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: myEvent
                })
            })
            .then(res=> {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events") 
                }                
            }).then(res=> {
                console.log(res.ping_data);
                const labelsArrayBlank = [];
                const labelsArray = [];
                const dataArray = [];
                res.ping_data.forEach(ping=> {
                    labelsArrayBlank.push(""); // ping.date
                    const newTime = new Date(ping.date).toLocaleTimeString();
                    labelsArray.push(newTime);
                    dataArray.push(ping.res_time);
                })
                if (labelsArray.length && dataArray.length > 0 ) {
                    this.setState({
                        labelsArray: labelsArray,
                        chartData: {
                        labels: labelsArrayBlank,
                        datasets: [{
                            label: 'Milliseconds',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: dataArray }] 
                        }
                    });
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    getChartData12H = ()=> {
        if(this.state.currentButton) this.setState({currentButton: false});
        try {
            const myEvent = {
                event_id: this.props.currentMonitor.eventID
            };
            fetch("http://localhost:5050/app/pingdata12", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify({
                    event: myEvent
                })
            })
            .then(res=> {
                if(res.status === 200) {
                    return res.json();
                } else {
                    throw Error("Failed to retrieve monitoring events") 
                }                
            }).then(res=> {
                console.log(res.ping_data);
                const labelsArrayBlank = [];
                const labelsArray = [];
                const dataArray = [];
                res.ping_data.forEach(ping=> {
                    labelsArrayBlank.push(""); // ping.date
                    const newTime = new Date(ping.date).toLocaleTimeString();
                    labelsArray.push(newTime);
                    dataArray.push(ping.res_time);
                })
                if (labelsArray.length && dataArray.length > 0 ) {
                    this.setState({
                        labelsArray: labelsArray,
                        chartData: {
                        labels: labelsArrayBlank,
                        datasets: [{
                            label: 'Milliseconds',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: dataArray }] 
                        }
                    });
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    render() {        
        const { chartData, currentButton, labelsArray } = this.state;
        const options = {
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    const index = tooltipItem.index;
                    return dataset.data[index];
                },
                title: function(tooltipItem, data) {
                  return labelsArray[tooltipItem[0].index];
                }
              }
            }
        };
        return (
            <Container fluid="md">
                <Row>
                    <Col xs lg="12">
                        <Button variant="outline-success" className="float-right ml-2" size="sm" onClick={this.getChartData}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                            </svg>
                        </Button>
                        <ButtonGroup aria-label="Basic example" className="float-right">
                            <Button variant="secondary" onClick={this.getChartData} active={currentButton}>1H</Button>
                            <Button variant="secondary" onClick={this.getChartData2H}>2H</Button>
                            <Button variant="secondary" onClick={this.getChartData3H}>3H</Button>
                            <Button variant="secondary" onClick={this.getChartData6H}>6H</Button>
                            <Button variant="secondary" onClick={this.getChartData12H}>12H</Button>
                            {/* <Button variant="secondary" active={false}>More</Button> */}
                        </ButtonGroup>
                        {/* <h4 className="text-center">{this.props.currentMonitor.eventName} Monitor Data</h4> */}
                        {/* <h4>{this.props.currentMonitor.eventStatus}</h4> */}
                    </Col>
                </Row>
                <Row>
                    <Col xs lg="12">                        
                        <h5 className="text-center">Response Time</h5>                        
                        <Line data={chartData} options={options} />
                    </Col>
                </Row>
                <Row>
                    <Col xs lg="12">
                        <EventLogs eventID={this.props.currentMonitor.eventID} />
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default MonitorData;