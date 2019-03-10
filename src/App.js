import React, {Component} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import Select from 'react-select';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
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

    renderRow(row) {
        return (
            <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.total_invested.toFixed(2)}</td>
                <td>{row.portfolio_value.toFixed(2)}</td>
            </tr>)
    }

    calculateChartValues() {
        const options = {
            animationEnabled: true,
            title: {
                text: "AAPL Investing Results"
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
                dataPoints: [
                    {x: new Date(2017, 0), y: 2506},
                    {x: new Date(2017, 1), y: 2798},
                    {x: new Date(2017, 2), y: 4280},
                    {x: new Date(2017, 3), y: 3240},
                    {x: new Date(2017, 4), y: 3526},
                    {x: new Date(2017, 5), y: 3390},
                    {x: new Date(2017, 6), y: 4000},
                    {x: new Date(2017, 7), y: 5250},
                    {x: new Date(2017, 8), y: 3230},
                    {x: new Date(2017, 9), y: 4200},
                    {x: new Date(2017, 10), y: 3716},
                    {x: new Date(2017, 11), y: 3840}
                ]
            },
                {
                    type: "spline",
                    name: "Portfolio Value",
                    showInLegend: true,
                    yValueFormatString: "$#,###",
                    xValueFormatString: "MM/YYYY",
                    dataPoints: [
                        {x: new Date(2017, 0), y: 25060},
                        {x: new Date(2017, 1), y: 27980},
                        {x: new Date(2017, 2), y: 42800},
                        {x: new Date(2017, 3), y: 32400},
                        {x: new Date(2017, 4), y: 35260},
                        {x: new Date(2017, 5), y: 33900},
                        {x: new Date(2017, 6), y: 40000},
                        {x: new Date(2017, 7), y: 52500},
                        {x: new Date(2017, 8), y: 32300},
                        {x: new Date(2017, 9), y: 42000},
                        {x: new Date(2017, 10), y: 37160},
                        {x: new Date(2017, 11), y: 38400}
                    ]
                }]
        };
        console.log(options);
        return options;
    }

    render() {
        const options = this.calculateChartValues();
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
                <CanvasJSChart options={options}/>
                <Table>
                    <tbody>
                    <tr>
                        <th>Date</th>
                        <th>Total Invested</th>
                        <th>Portfolio Value</th>
                    </tr>
                    {this.state.calculationResult.map(this.renderRow)}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default App;
