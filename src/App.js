import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getAssignedSummary} from './actions/summary';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import IssuesTable from './components/IssuesTable';
import SummaryAssignee from './components/SummaryAssignee';
import './css/main.css'

class App extends Component {

	componentDidMount(){
		this.props.getSummary()
	}

	render() {
		return (
			<div className="App">
				<AppBar title="Jira report tool"/>
				<Paper zDepth={1}>
					<IssuesTable />
				</Paper>
				<Paper zDepth={1}>
					<SummaryAssignee summary={this.props.summary}/>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		issues : state.tickets.sorted,
		summary: state.summary.assignedSummary
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getSummary(){
			dispatch(getAssignedSummary())
		}
	} 
}

App = connect(
	mapStateToProps,
	mapDispatchToProps
)(App)

export default App;
