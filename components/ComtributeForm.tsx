import React, { Component } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import Router from 'next/router'

interface ContributeFormProps {
  address: string;
}

class ContributeForm extends Component<ContributeFormProps> {
  state = {
    value: '',
    errorMessage: '',
    loading: false
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address)

    this.setState({ loading: true, errorMessage: '' })

    try {
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      })

      Router.push(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }

    this.setState({ loading: false });
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input label="ether" labelPosition="right" onChange={event => this.setState({ value: event.target.value })} />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage}></Message>
        <Button primary loading={this.state.loading} type="submit">Contribute</Button>
      </Form>
    );
  }
}

export default ContributeForm;
