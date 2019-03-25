import RSVP from 'rsvp';
import { get } from '@ember/object';
import { inject } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';
import PromiseProxyObject from 'frontend-gelinkt-notuleren/utils/promise-proxy-object';

export default Component.extend({
  tagName: '',
  ajax: inject(),

  /** Name of the resource to sign/publish (e.g. 'ontwerpagenda', 'aanvullende agenda', ... */
  name: null,
  /** Name of the current selected step */
  step: null,
  /** Versioned agenda to be signed/published */
  agenda: null,
  /** Editor document the agenda is derived from */
  currentEditorDocument: null,
  /** Function to trigger the signing of the agenda */
  sign: null,
  /** Function to trigger the publication of the agenda */
  publish: null,


  // This is an agenda object proxy onto which we dump a bunch of
  // contents necessary in the template.  Our construction works this
  // way to keep the template somewhat cleaner.
  mockAgenda: computed('agenda', 'currentEditorDocument', function(){
    if( this.agenda ) {
      // pick all info from the current agenda
      return PromiseProxyObject.create( {
        promise: RSVP.hash( {
          body: this.agenda.content,
          signedId: this.agenda.editorDocument.then( (ed) => ed.id )
        } )
      } );
    } else {
      // create an agenda with dumped contents and put it in a promise proxy
      return PromiseProxyObject.create({
        promise: RSVP.hash( {
          body: this.ajax
            .request(`/prepublish/agenda/${this.currentEditorDocument.id}`)
            .then( (response) => get(response, "data.attributes.content") ),
          signedId: get( this, 'currentEditorDocument.id' )
        })
      });
    }
  })
});
