export function openSubtasks(issueId){
  console.log(issueId)
  return {type: 'OPEN_SUBTASKS', issueId}
}