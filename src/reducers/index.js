import { combineReducers } from 'redux';
import issues from '../../mocks/issues.json';

const initialState = issues;

function getAssignedTaskSummary (state) {
  let summary = state.issues.map((issue) => {
    let name, key, estimate;
    let fields = issue.fields;
    if(fields.assignee){
      name = fields.assignee.name;
      key = fields.assignee.key;
    } else {
      name = 'Unassigned';
      key = 'unassigned';
    }
    estimate = fields.timeestimate || 0;
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

function tickets(state = initialState, action){
  switch(action.type){
    default:
      return state
  }
}

function summary(state = initialState, action){
  switch (action.type){
    default: 
      return getAssignedTaskSummary(state);
  }
}


const reducer = combineReducers({
  tickets,
  summary
});

export default reducer;