import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  tasklistPlugin: service('rdfa-editor-document-tasklist-plugin'),
  store: service(),
  classNames: ['tasklist'],
  classNameBindings: ['hasTasks:tasklist--open', 'isExpanded:tasklist--expanded'],
  hasTasks: computed('tasklistSolutions', function() { return (this.tasklistSolutions || []).length > 0; }),
  isExpanded: false,

  tasklistObserver: task(function *(){
    yield timeout(100);

    //get new tasklists to display
    let tasklists = this.tasklistPlugin.tasklistData;

    if(!tasklists)
      return;

    tasklists = tasklists.toArray();

    //match solutions
    let existingSolutions = (yield this.findMatchingSolutions(tasklists)).sort(this.sortByIndexAsc);

    //create the new tasksolutions, i.e. the ones with no solution
    //and update them in editorDocument.content
    let brandNewSolutions = yield this.updateAndCreateNewTaskLists(tasklists);

    let updatedTaskSolutions = [...existingSolutions, ...brandNewSolutions];

    updatedTaskSolutions = yield this.addIndexes(updatedTaskSolutions, (existingSolutions[0] || {}).index || 0);

    //and put them in bucket to display
    this.set('tasklistSolutions', updatedTaskSolutions);
  }).keepLatest(),

  swapIndex: task(function*(indexA, indexB){
    let solutionA = this.tasklistSolutions[indexA];
    let solutionB = this.tasklistSolutions[indexB];
    solutionA.set('index', indexB);
    solutionB.set('index', indexA);
    yield solutionA.save();
    yield solutionB.save();
    this.set('tasklistSolutions', this.tasklistSolutions.sort(this.sortByIndexAsc));
    this.propertyDidChange('tasklistSolutions');
  }),

  async findMatchingSolutions(tasklists){
    if(tasklists.length == 0)
      return [];
    let solution = await this.findTasklistSolution(tasklists[0].tasklistData.tasklistSolutionUri);
    let remaining =  await this.findMatchingSolutions(tasklists.slice(1));
    if(solution)
      return [solution, ...remaining];
    return remaining;
  },

  async createTasklistSolution(tasklistUri){
    let tasklistSolution = this.store.createRecord('tasklist-solution');
    let tasklist = (await this.store.query('tasklist', {'filter[:uri:]': tasklistUri})).firstObject;
    tasklistSolution.set('tasklist', tasklist);
    await tasklistSolution.save();
    return tasklistSolution;
  },

  async findTasklistSolution(solutionUri){
    if(!solutionUri)
      return null;
    let tasklistSolution = (await this.store.query('tasklist-solution', { 'filter[:uri:]': solutionUri }));
    if(tasklistSolution)
      return tasklistSolution.firstObject;
    return null;
  },

  async addIndexes(sortedTasklists, currIndex = 0){
    if(sortedTasklists.length == 0)
      return sortedTasklists;
    sortedTasklists[0].set('index', sortedTasklists[0].index || currIndex);
    await sortedTasklists[0].save();
    return  [sortedTasklists[0], ... await this.addIndexes(sortedTasklists.slice(1), currIndex + 1)];
  },

  async updateAndCreateNewTaskLists(tasklists){
    let tasklistsNoSolution = tasklists.filter(ts => !ts.tasklistData.tasklistSolutionUri);
    return Promise.all(tasklistsNoSolution.map(async ts => {
      let tasklistSolution = await this.createTasklistSolution(ts.tasklistData.tasklistUri);
      //update document content
      this.tasklistPlugin.setTaskSolutionUri(ts, tasklistSolution.uri);
      return tasklistSolution;
    }));
  },

  didReceiveAttrs(){
    this._super(...arguments);
    if(this.tasklistPlugin){
      this.tasklistObserver.perform(); //initial load
      this.tasklistPlugin.addObserver('tasklistData.[]',
                                      () => {return this.tasklistObserver.perform();});
    }
  },

  sortByIndexAsc(a, b){
    return a.index - b.index;
  },

  actions: {
    expandTasklist(){
      this.toggleProperty('isExpanded');
    },

    moveUp(tasklistSolution){
      if(tasklistSolution.index == 0)
        return;
      this.swapIndex.perform(tasklistSolution.index, tasklistSolution.index - 1);
    },

    moveDown(tasklistSolution){
      if(tasklistSolution.index == this.tasklistSolutions.length)
        return;
      this.swapIndex.perform(tasklistSolution.index, tasklistSolution.index + 1);
    }
  }
});
