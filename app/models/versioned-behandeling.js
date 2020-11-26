import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  state: attr(),
  content: attr(),
  uri: attr(),
  signedResources: hasMany('signed-resource'),
  publishedResource: belongsTo('published-resource'),
  zitting: belongsTo('zitting'),
  behandeling: belongsTo('behandeling-van-agendapunt')
});
