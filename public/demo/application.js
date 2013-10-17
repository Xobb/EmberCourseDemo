var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.Router.map(function() {
  this.route('credits');
  this.resource('contacts', function() {
    this.resource('contact', { path: '/:contact_id' });
  });

  this.resource('products', function() {
    this.route('seasonal');
    this.route('sale');
    this.resource('product', { path: '/:product_id' });  
  });
});



// Index
App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('product');
  }
});
App.IndexController = Ember.ArrayController.extend({
  onSale: function() {
    return this.filterProperty('isOnSale', true).slice(0,3);
  }.property('@each.isOnSale'),

  productCount: function() {
    return this.get('length');
  }.property('length')

  // product_count: 4
});





// Products
App.ProductsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('product');
  }
});
App.ProductsIndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('products');
  }
});
App.ProductsSeasonalRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('products').filterProperty('isSeasonal', true);
  }
});
App.ProductsSaleRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('products').filterProperty('isOnSale', true);
  }
});
App.ProductsController = Ember.ArrayController.extend({
  sortProperties: ['title'],
  count: function() {
    return this.get('length');
  }.property('@each'),

  // Slides
  onSale: function() {
    return this.filterProperty('isOnSale', true).get('length');
  }.property('@each.isOnSale'),

  // Challenges
  seasonal: function () {
    return this.filterProperty('isSeasonal', true).get('length');
  }.property('@each.isSeasonal'),
});

App.ProductController = Ember.ObjectController.extend({
  hasRatings: function() {
    return this.get('ratings').get('length') > 0;
  }.property('ratings.@each.score'),
  actions: {
    addRating: function(product, stars) {
      var rating = this.store.createRecord('rating', {stars: 1})
      product.get('ratings').pushObject(rating)
      // todo
      //product.get('ratings').createRecord({stars: 1})

      // Set the current user as having rated this product
      this.set('isUnrated', false);
    }
  },
  isUnrated: true
});





// Contacts
App.ContactsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('contact');
  }
});
App.ContactsController = Ember.ArrayController.extend({
  sortProperties: ['name']
});





// Handlebars
Ember.Handlebars.registerBoundHelper('money', function(value) {
  return "$" + (value / 100);
});



// Components
App.ProductDetailComponent = Ember.Component.extend({
  classNames: ['product-detail']
});


// Data
App.ApplicationAdapter = DS.FixtureAdapter.extend();
//App.ApplicationAdapter = DS.RESTAdapter.extend();
var attr = DS.attr;
App.Product = DS.Model.extend({
  title: DS.attr(),
  price: DS.attr(),
  description: DS.attr(),
  image: DS.attr(),
  imageCredit: DS.attr(),
  isOnSale: DS.attr('boolean'),
  isSeasonal: DS.attr('boolean'),
  ratings: DS.hasMany('rating', {async: true}),

  rating: function() {
    var stars = this.get('ratings').getEach('stars')
    var total = stars.reduce(function(accum, stars) {
      return accum + stars;
    }, 0);
    return total / stars.length;
  }.property('ratings.@each.stars')
});

App.Product.FIXTURES = [
  {
    id: 1,
    title: 'Acorn',
    price: '0.99',
    description: 'These fell right out of the tree -- or were left unguarded.',
    isOnSale: true,
    isSeasonal: true,
    ratings: [100, 101],
    image: 'images/products/acorn.jpg',
    imageCredit: 'http://www.flickr.com/photos/72284410@N08/9971732525/'
  },
  {
    id: 2,
    title: 'Pinecone',
    price: '2.49',
    description: 'A seasonal treat fresh from the pines.',
    isOnSale: false,
    isSeasonal: true,
    ratings: [102, 103],
    image: 'images/products/pinecone.png',
    imageCredit: 'http://www.flickr.com/photos/beana_cheese/2878352220/'
  },
  {
    id: 3,
    title: 'Blackberries',
    price: '4.99',
    description: 'Got a sweet tooth? They might be hard to get to, but worth the trouble!',
    isOnSale: true,
    isSeasonal: true,
    ratings: [104],
    image: 'images/products/blackberries.jpg',
    imageCredit: 'http://www.flickr.com/photos/john_mabbitt/8067821300/'
  },
  {
    id: 4,
    title: 'Peanuts',
    price: '1.99',
    description: 'Worth digging for, or ripped from a squirrels nest.',
    isOnSale: false,
    isSeasonal: false,
    ratings: [],
    image: 'images/products/blackberries.jpg',
    imageCredit: 'http://www.flickr.com/photos/john_mabbitt/8067821300/'
  },
  {
    id: 5,
    title: 'Mushrooms',
    price: '9.99',
    description: 'Freshly grown due to recent rain!',
    isOnSale: true,
    isSeasonal: false,
    ratings: [],
    image: 'images/products/blackberries.jpg',
    imageCredit: 'http://www.flickr.com/photos/john_mabbitt/8067821300/'
  },
  {
    id: 6,
    title: 'Eggs',
    price: '19.99',
    description: 'A rare and dangerous treat to come across.',
    isOnSale: true,
    isSeasonal: false,
    ratings: [],
    image: 'images/products/blackberries.jpg',
    imageCredit: 'http://www.flickr.com/photos/john_mabbitt/8067821300/'
  }
]

App.Rating = DS.Model.extend({
  stars: DS.attr('number'),
  product: DS.belongsTo('product'),
});

App.Rating.FIXTURES = [
  { id: 100, product: 1, stars: 2 },
  { id: 101, product: 1, stars: 5 },
  { id: 102, product: 2, stars: 5 },
  { id: 103, product: 2, stars: 4 },
  { id: 104, product: 3, stars: 1 },
]

App.Contact = DS.Model.extend({
  name: DS.attr(),
  avatar: DS.attr(),
  joined: DS.attr('number'),
  description: DS.attr()
});

App.Contact.FIXTURES = [
  { 
    id: 200, 
    name: 'Patty Pinecone',
    joined: 2010,
    avatar: 'images/contacts/patty.png',
    description: 'A master thief'
  },
  {
    id: 201,
    name: 'Acorn Adam',
    joined: 2010,
    avatar: 'images/contacts/adam.png',
    description: 'A master thief'
  },
  {
    id: 202,
    name: 'Martin Mushroom',
    joined: 2012,
    avatar: 'images/contacts/martin.png',
    description: 'A master thief'
  }
];