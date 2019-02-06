import { inject } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  ajax: inject(),
  model(){
    const documentContainer = this.modelFor('documents.show');
    return RSVP.hash({
      documentContainer: documentContainer,
      documentIdentifier: documentContainer.id,
      agendaContents: this.getAgendaContents( documentContainer ),
      editorDocument: this.getEditorDocument( documentContainer )
    });
  },
  async getAgendaContents(documentContainer) {
    const editorDocument = await documentContainer.get('currentVersion');
    const editorDocumentId = editorDocument.id;
    const requestUrl = `/prepublish/agenda/${editorDocumentId}`;
    const response = await this.ajax.request( requestUrl );
    return response.data.attributes.content;
  },
  async getEditorDocument( documentContainer ) {
    const editorDocument = await documentContainer.get('currentVersion');
    return editorDocument;
  }
});