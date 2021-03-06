import React, { Component } from 'react';
import Layout from '../../../../components/Layout';
import { Button, Table } from 'semantic-ui-react';
import Link from 'next/link';
import Campaign from '../../../../ethereum/campaign';
import RequestRow from '../../../../components/RequestRow';

interface RequestIndexProps {
  address: string;
  approversCount: number;
  requestsCount: number;
  requests: Request[];
}

interface Request {
  description: string;
  value: string;
  recipient: string;
  completed: boolean;
  approvalCount: string;
}

class RequestIndex extends Component<RequestIndexProps> {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);
    const requestsCount = await campaign.methods.requestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill({})
        .map((_, index) => {
          return campaign.methods.requests(index).call();
        })
    )
  
    return { address, requests, requestsCount, approversCount };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index.toString()}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      )
    })
  }

  render() {
    return (
      <Layout>
        <h3>Requests</h3>
        <Link href={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
          </a>
        </Link>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Recipient</Table.HeaderCell>
              <Table.HeaderCell>Approval Count</Table.HeaderCell>
              <Table.HeaderCell>Approve</Table.HeaderCell>
              <Table.HeaderCell>Finalize</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.renderRows()}
          </Table.Body>
        </Table>
        <div>Found {this.props.requestsCount} Requests</div>
      </Layout>
    );
  }
}

export default RequestIndex;
