import React, { Component } from 'react';
import {connect} from 'react-redux';
import {openSubtasks} from '../actions/issues';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import moment from 'moment';


class IssuesTable extends Component {
	constructor(props){
		super(props)
		this.state = {
			visible: true,
			stats: this.getStats()
		}
	}

	toggleVisibility = () =>{
		this.setState({visible: !this.state.visible})
	}

	getTimeEstimate(seconds) {
		if (seconds > 60) {
			return moment.duration(seconds, 'seconds').humanize()
		} else return "Unestimated"
	}

	getRemainingEstimate(seconds){
		if (seconds > 60 ){
			return moment.duration(seconds, 'seconds').humanize()
		} else return ''
	}

	getAssignee(fields){
		if(!fields.assignee){
			return "Unassigned"
		} else {
			return fields.assignee.displayName
		}
	}

	getStats(){
		let stats = {
			totalEstimated: 0,
			missingEstimateCount: 0
		}
		this.props.issues.forEach((issue)=>{
			stats.totalEstimated += issue.fields.timeoriginalestimate || 0
			if(issue.fields.timeoriginalestimate === 0 || issue.fields.timeoriginalestimate === null){
				stats.missingEstimateCount++;
			}
		})
		return stats;
	}

	getEpicName(key){
		switch(key){
			case 'FIT-751':
				return 'Venevakuutus'
			case 'FIT-1182':
				return 'Apollo'
			default:
				return ''
		}
	}

	showSubtasks(rowIndex){
		let issueId = this.props.issues[rowIndex].id;
		this.props.openSubtasks(issueId);
	}

	issueRow (issue) {
		let fields = issue.fields;
		return (<TableRow key={issue.key} >
			<TableRowColumn>{fields.issuetype.name}</TableRowColumn>
			<TableRowColumn>{issue.key}</TableRowColumn>
			<TableRowColumn>{fields.summary}</TableRowColumn>
			<TableRowColumn>{this.getAssignee(fields)}</TableRowColumn>
			<TableRowColumn>{fields.priority.name}</TableRowColumn>
			<TableRowColumn>{fields.status.name}</TableRowColumn>
			<TableRowColumn>{this.getEpicName(fields.customfield_10006)}</TableRowColumn>
			<TableRowColumn>{this.getTimeEstimate(fields.timeoriginalestimate)}</TableRowColumn>
			<TableRowColumn>{this.getRemainingEstimate(fields.timespent)}</TableRowColumn>
		</TableRow>)
	}

	render(){
		let rows;
		if(this.state.visible){
			 rows = this.props.issues.map( (issue) =>{
				return this.issueRow(issue);
			 })
		}
		return(
			<div>
				<Table showCheckboxes={false} onCellClick={(rowIndex) => this.showSubtasks(rowIndex)}>
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<TableRow>
							<TableHeaderColumn>
								{`Löytyi ${this.props.issues.length} tehätvää`}
							</TableHeaderColumn>
							<TableHeaderColumn>
								<Checkbox label="Piilota tehtävät"
								checked={!this.state.visible}
								onCheck={this.toggleVisibility}/>	
							</TableHeaderColumn>
						</TableRow>
						<TableRow>
							<TableHeaderColumn>Tyyppi</TableHeaderColumn>
							<TableHeaderColumn>ID</TableHeaderColumn>
							<TableHeaderColumn>Kuvaus</TableHeaderColumn>
							<TableHeaderColumn>Vastaava</TableHeaderColumn>
							<TableHeaderColumn>Prioriteetti</TableHeaderColumn>
							<TableHeaderColumn>Status</TableHeaderColumn>
							<TableHeaderColumn>Epic</TableHeaderColumn>
							<TableHeaderColumn>Alkup. arvio</TableHeaderColumn>
							<TableHeaderColumn>Jäljellä / käytetty</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody displayRowCheckbox={false}>
						{rows}
					</TableBody>
				</Table>
				<div>
					<h3> Alkuperäinen arvio yhteensä </h3>
					<span>{moment.duration(this.state.stats.totalEstimated, 'seconds').humanize()}</span>
					<h3>Tehtäviä ilman aika-arvioita</h3>
					<span>{this.state.stats.missingEstimateCount}</span>
				</div>
			</div>
	)}
}

const mapDispatchToProps = (dispatch) => {
	return {
		openSubtasks(taskId){
			dispatch(openSubtasks(taskId));
		}
	}
}

IssuesTable = connect(
	null,
	mapDispatchToProps
)(IssuesTable);

export default IssuesTable