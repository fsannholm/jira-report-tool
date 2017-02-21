import { combineReducers } from 'redux';
import issues from '../../mocks/issues.json';
import cloneDeep from 'lodash.clonedeep'; 

const initialState = {
  issues: issues.issues,
  subtasks: getSubTasks(issues), 
  sorted: arrangeSubtasks(issues)
};

const initialSummaryState = {assignedSummary: []}

function getAssignedTaskSummary () {
  let summary = initialState.issues.map((issue) => {
    let name, key, estimate;
    let fields = issue.fields;
    if(fields.assignee){
      name = fields.assignee.displayName;
      key = fields.assignee.key;
    } else {
      name = 'Unassigned';
      key = 'unassigned';
    }
    estimate = fields.timeoriginalestimate || 0;
    return { name: name, key: key, timeestimate: estimate};
  });

  let summaryFilter = [];
  summary.forEach( (item) =>{
    let exists = summaryFilter.some( e => {
      return item.key === e.key
    });
    if(!exists){
      summaryFilter.push(item)
    } else {
      summaryFilter.forEach(f =>{
        if(f.key === item.key){
          f.timeestimate += item.timeestimate
        }
      });
    }
  });
  return summaryFilter;
}

function getSubTasks(state){
  return state.issues.filter(issue => {
    return issue.fields.issuetype.subtask
  });
}

function getTopLevelTasks(state){
  return state.issues.filter(issue => {
    return !issue.fields.issuetype.subtask
  });
}

function arrangeSubtasks(state){
  let topLevel = getTopLevelTasks(state);
  let subtasks = getSubTasks(state);
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

function setSubtasksVisible(sorted, id){
  return sorted.map((item) =>{
    if(id === item.id){
      return Object.assign({}, item, {
        showSubtasks: !item.showSubtasks
      })
    }
  })
}

function tickets(state = initialState, action){
  switch(action.type){
    case 'OPEN_SUBTASKS':
      console.log('subtasks')
      return Object.assign({}, state, {sorted: state.sorted.map((issue) =>{
        if(issue.id === action.issueId){
          return Object.assign({}, issue, {
            showSubtasks: !issue.showSubtasks
          })
        }
        return issue
      })
    });
    default:
      console.log('default')
      return state
  }
}

function summary(state = initialSummaryState, action){
  switch (action.type){
    case 'GET_ASSIGNED_SUMMARY':
      console.log('GET_ASSIGNED_SUMMARY')
      console.log(state)
      return {...state, assignedSummary: getAssignedTaskSummary(state)};
    default:
      return state
  }
}


const reducer = combineReducers({
  tickets,
  summary
});

export default reducer;