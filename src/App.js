import React, {Component} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import Select from 'react-select';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {FormGroup} from "react-bootstrap";
import axios from 'axios'

import CanvasJSReact from './canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const api = 'http://127.0.0.1:8000/api/';

class App extends Component {

    constructor(props) {
        super(props);
        let startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 20);
        this.state = {
            selectedAsset: {value: 'AAPL', label: 'Apple Inc.'},
            startDate: startDate.toISOString().slice(0, 10),
            monthlyAmount: 100,
            options: [
                {value: 'AAPL', label: 'Apple Inc.'},
                {value: 'FB', label: 'Facebook Inc.'},
                {value: 'AMZN', label: 'Amazon.com Inc.'},
                {value: 'GOOGL', label: 'Alphabet Inc.'},
                {value: 'MSFT', label: 'Microsoft Corporation'}
            ],
            calculationResult: []
        }
    }

    componentDidMount() {
        this.calculateResult()
    }

    calculateResult = () => {
        axios({
            method: 'get',
            url: api + 'calculate',
            params: {
                start: this.state.startDate,
                ticker: this.state.selectedAsset.value,
                monthly: this.state.monthlyAmount
            },
            config: {headers: {"Access-Control-Allow-Origin": "*"}}
        })
            .then(response => {
                this.setState({
                        calculationResult: response.data
                    }
                )
            })
    }

    handleAssetChange = (selectedOption) => {
        this.setState({
            selectedAsset: selectedOption
        });
    }

    handleDateChange = (event) => {
        this.setState({
            startDate: event.target.value
        });
    }

    handleAmountChange = (event) => {
        this.setState({
            monthlyAmount: event.target.value
        });
    }

    handleInputChange = (input) => {
        console.log(`input is:`, input);
        var bodyFormData = new FormData();
        bodyFormData.set('search', input);
        axios({
            method: 'post',
            url: api + 'search',
            data: bodyFormData,
            config: {headers: {"Access-Control-Allow-Origin": "*"}}
        })
            .then(response => {
                //handle success
                var new_options = [];
                response.data.forEach((element) => {
                    new_options.push({
                        value: element.fields.ticker,
                        label: element.fields.ticker + " | " + element.fields.name
                    })
                });
                this.setState({
                    options: new_options
                });
            })
    }

    calculateChartValues() {
        var totalInvested = [];
        var portfolioValue = [];
        this.state.calculationResult.forEach(element => {
            totalInvested.push({
                x: new Date(element.date),
                y: element.total_invested
            });
            portfolioValue.push({
                x: new Date(element.date),
                y: element.portfolio_value
            })
        });
        const options = {
            animationEnabled: true,
            title: {
                text: this.state.calculationResult[0].ticker + " Investing Results"
            },
            toolTip: {
                shared: true
            },
            data: [{
                type: "spline",
                name: "Total Invested",
                showInLegend: true,
                yValueFormatString: "$#,###",
                xValueFormatString: "MM/YYYY",
                dataPoints: totalInvested
            },
                {
                    type: "spline",
                    name: "Portfolio Value",
                    showInLegend: true,
                    yValueFormatString: "$#,###",
                    xValueFormatString: "MM/YYYY",
                    dataPoints: portfolioValue
                }]
        };
        console.log(options);
        return options;
    }

    render() {
        return (
            <Container>
                <Form>
                    <FormGroup>
                        <Form.Label>Choose how much to invest every month</Form.Label>
                        <Form.Control type="date" onChange={this.handleDateChange} value={this.state.startDate}/>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Choose how much to invest every month</Form.Label>
                        <Form.Control type="number" onChange={this.handleAmountChange}
                                      value={this.state.monthlyAmount}/>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Choose an asset to invest in</Form.Label>
                        <Select
                            value={this.state.selectedAsset}
                            onChange={this.handleAssetChange}
                            options={this.state.options}
                            onInputChange={this.handleInputChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Button
                            variant="primary"
                            onClick={this.calculateResult}>
                            Calculate
                        </Button>
                    </FormGroup>
                </Form>
                {this.state.calculationResult.length > 0 && <CanvasJSChart options={this.calculateChartValues()}/>}
            </Container>
        );
    }
}

export default App;
