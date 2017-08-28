// @flow
import React, { Component } from "react";
import { SingleDatePicker } from "react-dates";
import SideNav from "./SideNav";
import Select from "react-select";
import moment from "moment";
import Item from "./Item";
import { connect } from "react-redux";

const today = moment();
const tomorrow  = moment(new Date()).add(1,"days");

type Props = {
    currency: Object,
    addInfo: {
        discount: ?number,
        tax: ?number
    }
};

type State = {
    invoiceNumber: string,
    issueDate: ?Date,
    dueDate: ?Date,
    job: string,
    status: {value: ?string, label: ?string},
    issueFocused: boolean,
    dueFocused: boolean,
    to: string,
    from: string,
    addressTo: string,
    addressFrom: string,
    phoneTo: string,
    phoneFrom: string,
    emailTo: string,
    emailFrom: string
};

const options = [
    { value: "paid", label: "Paid"},
    { value: "due", label: "Due"},
    { value: "overdue", label: "Overdue"},
    { value: "onhold", label: "On Hold"},
]

class Invoice extends Component {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            invoiceNumber: "001",
            issueDate: today,
            dueDate: tomorrow,
            job: "",
            status: { value: "paid", label: "Paid"},
            issueFocused: false,
            dueFocused: false,
            to: "",
            from: "",
            addressTo: "",
            addressFrom: "",
            phoneTo: "",
            phoneFrom: "",
            emailTo: "",
            emailFrom: "",
        }
    }

    handleChange = (e: Event) => {
        if (e.target instanceof HTMLInputElement) {
            const { name, value } = e.target;
            this.setState({
                [name]: value
            });
        }
    }

    selectChange = (val: {value: ?string, label: ?string}) => {
        if (val) {
            this.setState({
                status: val
            });
        }else {
            this.setState({
                status: { value: "paid", label: "Paid"}
            });
        }
    }

    render() {
        const {items} = this.props;
        const { addInfo } = this.props;
        let discountElement;
        let price = 0;
        let subTotal = 0;
        let discount = 0;
        let tax = 0;

        if (addInfo["discount"] && addInfo["discount"] > 0) {
            console.log(price * discount);
            discountElement = (<div>
                            <span>Discount</span>
                            <h2>{addInfo["discount"]} %</h2>
                        </div>);
        }

        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                if (items[key] && parseInt(items[key]["quantity"]) > 0 && parseInt(items[key]["amount"]) > 0) {
                    price += items[key]["quantity"] * items[key]["amount"];
                    subTotal += items[key]["quantity"] * items[key]["amount"];
                    discount = (addInfo["discount"] / 100);
                    tax = (addInfo["tax"] / 100);
                    price = (price - (price * discount) + (price * tax)).toFixed(2);
                }
            }
        }
        return (
            <div className="wrapper">
                <div className="invoice">
                    <div className="invoice__header">
                        <Select
                            name="status"
                            value={this.state.status}
                            options={options}
                            onChange={this.selectChange}
                        />
                        <h2>Invoice</h2>
                    </div>

                    <div className="invoice__info">
                        <div className="info">
                            <label htmlFor="date">Date</label>
                            <SingleDatePicker
                                date={this.state.issueDate}
                                focused={this.state.issueFocused}
                                numberOfMonths={1}
                                onDateChange={date => this.setState({ issueDate: date })}
                                onFocusChange={({focused}) => this.setState({ issueFocused: !this.state.issueFocused})}
                                isOutsideRange={() => false}
                                />
                        </div>

                        <div className="info">
                            <label htmlFor="date">Due Date</label>
                            <SingleDatePicker
                                date={this.state.dueDate}
                                focused={this.state.dueFocused}
                                numberOfMonths={1}
                                onDateChange={date => this.setState({ dueDate: date })}
                                onFocusChange={({focused}) => this.setState({ dueFocused: !this.state.dueFocused})}
                                />
                        </div>

                        <div className="info">
                            <label htmlFor="invoice">Invoice #</label>
                            <input
                                className="input-element input-element--number"
                                name="invoiceNumber"
                                value={this.state.invoiceNumber}
                                onChange={this.handleChange}
                                placeholder="Invoice Number"
                                />
                        </div>

                        <div className="info">
                            <label htmlFor="job">Job</label>
                            <input
                                className="input-element"
                                name="job"
                                value={this.state.job}
                                onChange={this.handleChange}
                                placeholder="Description"
                                />
                        </div>
                    </div>

                    <div className="invoice__info">
                        <div className="address-element">
                            <label htmlFor="from">Bill from:</label>
                            <input 
                                type="text"
                                className="input-element" 
                                name="from"
                                value={this.state.from}
                                onChange={this.handleChange}
                                placeholder="From"
                                />
                            <textarea 
                                name="addressFrom"
                                value={this.state.addressFrom}
                                onChange={this.handleChange}
                                placeholder="Address"
                            />
                            <input 
                                type="text"
                                className="input-element" 
                                name="phoneFrom"
                                value={this.state.phoneFrom}
                                onChange={this.handleChange}
                                placeholder="Phone"
                                />
                            <input 
                                type="email"
                                className="input-element" 
                                name="emailFrom"
                                value={this.state.emailFrom}
                                onChange={this.handleChange}
                                placeholder="Email"
                                />
                        </div>
                        <div className="address-element">
                            <label htmlFor="to">Bill to:</label>
                            <input 
                                type="text"
                                className="input-element" 
                                name="to"
                                value={this.state.to}
                                onChange={this.handleChange}
                                placeholder="To"
                                />
                            <textarea 
                                name="addressTo"
                                value={this.state.addressTo}
                                onChange={this.handleChange}
                                placeholder="Address"
                            />
                            <input 
                                type="text"
                                className="input-element" 
                                name="phoneTo"
                                value={this.state.phoneTo}
                                onChange={this.handleChange}
                                placeholder="Phone"
                                />
                            <input 
                                type="email"
                                className="input-element" 
                                name="emailTo"
                                value={this.state.emailTo}
                                onChange={this.handleChange}
                                placeholder="Email"
                                />
                        </div>
                    </div>
                    <hr />
                    <Item />
                    <hr />
                    <div className="invoice__bill">
                        <div className="bill-detail">                        
                            <div>
                                <span>Subtotal</span>
                                <h2>{this.props.currency["value"]} {subTotal}</h2>
                            </div>
                            {discountElement}
                            <div>
                                <span>Taxes</span>
                                <h2>{this.props.addInfo["tax"] || 0} %</h2>
                            </div>
                            <div>
                                <span>Total ({this.props.currency["label"]})</span>
                                <h2 className="bill-total">{this.props.currency["value"]} {price}</h2>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        currency: state.currency,
        addInfo: state.addInfo,
        items: state.items
    }
}

export default connect(mapStateToProps, null)(Invoice);