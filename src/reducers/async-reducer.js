import {combineReducers} from 'redux';
import cloneDeep from 'lodash.clonedeep'; 
import {REQUEST_ISSUES, RECEIVE_ISSUES} from '../actions/issues';
import {GET_ASSIGNED_SUMMARY} from '../actions/summary';

function getSubTasks(issues){
  return issues.filter(issue => {
    return issue.fields.issuetype.subtask
  });
}

function getTopLevelTasks(issues){
  return issues.filter(issue => {
    return !issue.fields.issuetype.subtask
  });
}

function arrangeSubtasks(issues){
  let topLevel = getTopLevelTasks(issues);
  let subtasks = getSubTasks(issues);
  let rtn = topLevel.map((task,index)=>{
    let newTask = cloneDeep(task);
    newTask.showSubtasks = false;
    newTask.subtasks = subtasks.filter( (st) => {
      return st.fields.parent.id === task.id;
    })
    return newTask;
  })
  return rtn;
}

function issues( state = {isFetching: false, issues: [], sorted: []}, action){
    switch (action.type) {
        case REQUEST_ISSUES:
            return Object.assign({}, state, {isFetching: true})
        case RECEIVE_ISSUES:
            return Object.assign({}, state, {
                isFetching: false, 
                issues: action.issues,
                sorted: arrangeSubtasks(action.issues)
            })
    default: 
        return state
    }
}

function stats ( state = {assignedSummary: []}, action){
    switch (action.type){
        case GET_ASSIGNED_SUMMARY: 
            console.log('GET_ASSIGNED_SUMMARY')
            return Object.assign({}, state, {assignedSummary: action.issues});
        default:
            return state
    }
}

const rootReducer = combineReducers({
    issues,
    stats
});

export default rootReducer;