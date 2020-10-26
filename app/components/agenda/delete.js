import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AgendaDeleteComponent extends Component {
  @tracked isShowingWarning=false;

  @tracked hasAgreed=false;

  @action
  toggleWarning(){
    this.isShowingWarning=!this.isShowingWarning;
  }

  // @action
  // async delete(){
  //   await this.args.zitting.agendapunten.removeObject(this.args.agendapunt);
  //   this.args.toggleEditing();
  // }

}
