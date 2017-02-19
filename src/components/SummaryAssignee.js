import React, { Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment';

class SummaryAssignee extends Component {

  summaryRows() {
    return this.props.summary.map((person) => {
		return (
    <TableRow key={person.key}>
			<TableRowColumn>{person.name}</TableRowColumn>
			<TableRowColumn>{moment.duration(person.timeestimate, 'seconds').asHours()}</TableRowColumn>
		</TableRow>)
		})
  }

  render() {
    let rows = this.summaryRows();

    return (
      <div>
        <Table showCheckboxes={false} >
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<TableRow>
							<TableHeaderColumn>
								Placeholder
							</TableHeaderColumn>
						</TableRow>
						<TableRow>
							<TableHeaderColumn>Henkilö</TableHeaderColumn>
							<TableHeaderColumn>Tunnit</TableHeaderColumn>
					  </TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={false}>
						{rows}
					</TableBody>
				</Table>
      </div>
    );
  }
}

export default SummaryAssignee;
