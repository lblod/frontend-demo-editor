import Controller from "@ember/controller";
import {inject as service} from "@ember/service";
import {task} from "ember-concurrency-decorators";
import {tracked} from "@glimmer/tracking";
/** @typedef {import("../../../models/agenda").default} Agenda */
/** @typedef {import("../../../models/zitting").default} Zitting */


/**
 * @extends {Controller}
 * @property {Zitting} model
 */
export default class MeetingsPublishBesluitenlijstController extends Controller {
  @service ajax;

  @tracked
  besluitenlijst;

  constructor() {
    super(...arguments);
  }

  initialize() {
    this.initializeBesluitenLijst.perform();
  }


  @task
  * initializeBesluitenLijst() {
    const behandelings = yield this.store.query('besluiten-lijst',{
      'filter[zitting][:id:]': this.model.id,
      include: 'signed-resources,published-resource'
    });
    console.log(behandelings)
    if(behandelings.length) {
      this.besluitenlijst = behandelings.firstObject;
    } else {
      const prePublish = yield this.createPrePublishedResource.perform();
      const rslt = yield this.store.createRecord("besluiten-lijst", {
        zitting: this.model,
        content: prePublish
      });
      this.besluitenlijst = rslt;
    }
  }


  @task
  *createPrePublishedResource() {
    const id = this.model.id;
    const response = yield this.ajax.request(
      `/prepublish/besluitenlijst/${id}`
    );
    return response.data.attributes.content;
  }

  /**
   * @param {string} agendaType
   * @this {MeetingsPublishAgendaController}
   */
  @task
  * createSignedResource() {

    const id = this.model.id;
    yield this.ajax.post(
      `/signing/besluitenlijst/sign/${id}`
    );
    yield this.initializeBesluitenLijst.perform();
  }

  /**
   * @param {string} agendaType
   * @this {MeetingsPublishAgendaController}
   */
  @task
  * createPublishedResource() {
    const id = this.model.id;
    yield this.ajax.post(
      `/signing/besluitenlijst/publish/${id}`
    );
    yield this.initializeBesluitenLijst.perform();

  }
}
