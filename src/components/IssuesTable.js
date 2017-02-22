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
			stats.totalEstimated += issue.fields.timeoriginalestimate || 0;
			if(issue.subtasks.length){
				let sumSubtasks = 0;
				issue.subtasks.forEach((subtask) =>{
					sumSubtasks += subtask.fields.timeoriginalestimate || 0;
				});
			stats.totalEstimated += sumSubtasks;
			}
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

	getIssueCount(){
		let count = {
			issues: 0,
			stories: 0
		};
		this.props.issues.forEach((issue)=>{
			if(issue.subtasks.length){
				count.issues += issue.subtasks.length
				count.stories++
			} else count.issues++
		});
		return count;
	}

	showSubtasks(issueId){
		this.props.openSubtasks(issueId);
	}

	issueRow (issue) {
		let style = {};
		let fields = issue.fields;
		if(fields.issuetype.subtask){
			style = {
					'backgroundColor': 'rgb(124, 187, 195)'
			}
		}
		return (
		<TableRow onMouseUp={()=>this.showSubtasks(issue.id)} style={style}key={issue.key} >
			<TableRowColumn>{fields.issuetype.name}</TableRowColumn>
			<TableRowColumn>
				<a target="_blank" href={`${process.env.REACT_APP_JIRA_URL}browse/${issue.key}`}>{issue.key}</a>
			</TableRowColumn>
			<TableRowColumn title={fields.summary}>{fields.summary}</TableRowColumn>
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
				let rowsArr = [this.issueRow(issue)]
				if(issue.showSubtasks){
					let subtaskRows = issue.subtasks.map( i =>{
						return this.issueRow(i);
					});
					rowsArr = rowsArr.concat(subtaskRows);
				}
				return rowsArr;
			 })
		}
		return(
			<div>
				<Table showCheckboxes={false} >
					<TableHeader displaySelectAll={false} adjustForCheckbox={false}>
						<TableRow>
							<TableHeaderColumn>
								{`Yhteensä ${this.getIssueCount().issues} tehtävää
								ja ${this.getIssueCount().stories} tarinaa`}
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

const mapStateToProps = (state) =>{
	return {
		issues: state.tickets.sorted
	}
}

IssuesTable = connect(
	mapStateToProps,
	mapDispatchToProps
)(IssuesTable);

export default IssuesTable