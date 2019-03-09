import React, {Component} from 'react';
import './App.css';
import Container from 'react-bootstrap/Container'
import Select from 'react-select';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {FormGroup} from "react-bootstrap";


class App extends Component {

    constructor(props) {
        super(props);
        let startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 20);
        this.state = {
            selectedAsset: {value: 'vanilla', label: 'Vanilla'},
            startDate: startDate.toISOString().slice(0, 10),
            monthlyAmount: 100,
            options: [
                {value: 'chocolate', label: 'Chocolate'},
                {value: 'strawberry', label: 'Strawberry'},
                {value: 'vanilla', label: 'Vanilla'}
            ]
        }
    }

    handleAssetChange = (selectedOption) => {
        this.setState({
            selectedAsset: selectedOption
        });
        console.log(`Option selected:`, selectedOption);
    }

    handleDateChange = (event) => {
        console.log(`Date selected:`, event.target.value);
        this.setState({
            startDate: event.target.value
        });
    }

    handleAmountChange = (event) => {
        this.setState({
            monthlyAmount: event.target.value
        });
        console.log(`monthlyAmount selected:`, event.target.value);
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
                        />
                    </FormGroup>
                    <FormGroup>
                        <Button
                            variant="primary"
                            onClick={this.handleClick}>
                            Calculate
                        </Button>
                    </FormGroup>
                </Form>
            </Container>
        );
    }
}

export default App;
