import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getAssignedSummary} from './actions/summary';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import IssuesTable from './components/IssuesTable';
import SummaryAssignee from './components/SummaryAssignee';
import './css/main.css'

class App extends Component {

	componentWillMount(){
		this.props.getSummary()
	}

	render() {
		return (
			<div className="App">
				<AppBar title="Jira report tool"/>
				<Paper zDepth={1}>
					<IssuesTable issues={this.props.issues}/>
				</Paper>
				<Paper zDepth={1}>
					<SummaryAssignee summary={this.props.summary}/>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	console.log('loggin state')
	console.log(state);
	return {
		issues : state.tickets.sorted,
		summary: state.summary.assignedSummary
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getSummary(){
			console.log('dispatch assignedSummary()')
			dispatch(getAssignedSummary())
		}
	} 
}

App = connect(
	mapStateToProps,
	mapDispatchToProps
)(App)

export default App;
