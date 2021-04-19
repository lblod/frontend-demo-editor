import EmberRouter from '@ember/routing/router';
import config from 'frontend-gelinkt-notuleren/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('inbox', function() {
    this.route('trash');
    this.route('agendapoints');
    this.route('meetings');
  });
  this.route('mock-login');
  this.route('login');

  this.route('legaal', function() {
    this.route('disclaimer');
    this.route('cookieverklaring');
    this.route('toegankelijkheidsverklaring');
  });
  this.route('contact');
  this.route('print', function() {
    this.route('uittreksel', { path: '/uittreksel/:id' });
  });
  this.route('route-not-found', {
    path: '/*wildcard'
  });

  this.route('import', function() {
    this.route('new');
    this.route('edit');
  });

  this.route('agendapoints', function() {
    this.route('new');
    this.route('edit', { path: '/:id/edit' });
    this.route('show', { path: ':id/show'});
    this.route('revisions', { path: '/:id/revisions' });
  });

  this.route('meetings', function() {
    this.route('new');
    this.route('edit', { path: '/:id/edit' });
    this.route('publish',{path: '/:id/publish'}, function() {
      this.route('agenda');
      this.route('besluitenlijst');
      this.route('uittreksels');
      this.route('notulen');
    });
  });
});
