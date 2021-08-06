import React, { Component} from 'react';
import { Button, Table } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

interface RequestRowProps {
  id: string;
  address: string;
  request: Request;
  approversCount: number;
}

interface Request {
  description: string;
  value: string;
  recipient: string;
  completed: boolean;
  approvalCount: string;
}

class RequestRow extends Component<RequestRowProps> {
  onApprove = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);

    const accounts = await web3.eth.getAccounts();

    try {
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0]
      });
    } catch (err) {
      console.log(err)
    }
  }

  onFinalze = async (event) => {
    event.preventDefault();

    const campaign = Campaign(this.props.address);

    const accounts = await web3.eth.getAccounts();

    try {
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0]
      });
    } catch (err) {
      console.log(err)
    }

  }

  render() {
    const { id, request, approversCount } = this.props;
    const readyToFinalize = parseInt(request.approvalCount) > (approversCount/2);

    return (
      <Table.Row disabled={request.completed} positive={readyToFinalize && !request.completed}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{request.description}</Table.Cell>
        <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
        <Table.Cell>{request.recipient}</Table.Cell>
        <Table.Cell>{request.approvalCount}/{approversCount}</Table.Cell>
        <Table.Cell>
          {request.completed ? null : (
            <Button color="green" basic onClick={this.onApprove}>Approve</Button>
          )}
        </Table.Cell>
        <Table.Cell>
          {request.completed ? null : (
            <Button color="teal" basic onClick={this.onFinalze}>Finalize</Button>
          )}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default RequestRow;
