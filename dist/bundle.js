(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WEIGHT_PER_OX = _constants2.default.WEIGHT_PER_OX,
    WEIGHT_PER_PERSON = _constants2.default.WEIGHT_PER_PERSON,
    FOOD_WEIGHT = _constants2.default.FOOD_WEIGHT,
    FIREPOWER_WEIGHT = _constants2.default.FIREPOWER_WEIGHT,
    SLOW_SPEED = _constants2.default.SLOW_SPEED,
    FULL_SPEED = _constants2.default.FULL_SPEED,
    FOOD_PER_PERSON = _constants2.default.FOOD_PER_PERSON;

var Caravan = function () {
  function Caravan(stats) {
    _classCallCheck(this, Caravan);

    var day = stats.day,
        distance = stats.distance,
        crew = stats.crew,
        food = stats.food,
        oxen = stats.oxen,
        money = stats.money,
        firepower = stats.firepower;


    Object.assign(this, {
      day: day,
      distance: distance,
      crew: crew,
      food: food,
      oxen: oxen,
      money: money,
      firepower: firepower
    });
  }

  _createClass(Caravan, [{
    key: 'updateWeight',
    value: function updateWeight() {
      var droppedFood = 0,
          droppedGuns = 0;

      this.capacity = this.oxen * WEIGHT_PER_OX + this.crew * WEIGHT_PER_PERSON;
      this.weight = this.food * FOOD_WEIGHT + this.firepower * FIREPOWER_WEIGHT;

      while (this.firepower && this.capacity <= this.weight) {
        this.firepower--;
        this.weight -= FIREPOWER_WEIGHT;
        droppedGuns++;
      }

      if (droppedGuns) {
        this.ui.notify('Left ' + droppedFood + ' food provisions behind', 'negative');
      }
    }
  }, {
    key: 'updateDistance',
    value: function updateDistance() {
      var diff = this.capacity - this.weight;
      var speed = SLOW_SPEED + diff / this.capacity * FULL_SPEED;

      this.distance += speed;
    }
  }, {
    key: 'consumeFood',
    value: function consumeFood() {
      this.food -= this.crew * FOOD_PER_PERSON;

      if (this.food < 0) {
        this.food = 0;
      }
    }
  }]);

  return Caravan;
}();

exports.default = Caravan;

},{"./constants":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventTypes = require('./eventTypes');

var _eventTypes2 = _interopRequireDefault(_eventTypes);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ENEMY_FIREPOWER_AVG = _constants2.default.ENEMY_FIREPOWER_AVG,
    ENEMY_GOLD_AVG = _constants2.default.ENEMY_GOLD_AVG;

var Event = function () {
  function Event() {
    _classCallCheck(this, Event);
  }

  _createClass(Event, [{
    key: 'generateEvent',
    value: function generateEvent() {
      var eventIndex = Math.floor(Math.random() * _eventTypes2.default.length);
      var eventData = _eventTypes2.default[eventIndex];

      if (eventData.type == 'STAT-CHANGE') {
        this.stateChangeEvent(eventData);
      } else if (eventData.type == 'SHOP') {
        this.game.pauseJourney();
        this.ui.notify(eventData.text, eventData.notification);
        this.shopEvent(eventData);
      } else if (eventData.type == 'ATTACK') {
        this.game.pauseJourney();
        this.ui.notify(eventData.text, eventData.notification);
        this.attackEvent(eventData);
      }
    }
  }, {
    key: 'stateChangeEvent',
    value: function stateChangeEvent(eventData) {
      if (eventData.value + this.caravan[eventData.stat] >= 0) {
        this.caravan[eventData.stat] += eventData.value;
        this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
      }
    }
  }, {
    key: 'shopEvent',
    value: function shopEvent(eventData) {
      var products = [],
          j = void 0,
          priceFactor = void 0;
      var numProds = Math.ceil(Math.random() * 4);

      for (var i = 0; i < numProds; i++) {
        j = Math.floor(Math.random() * eventData.products.length);
        priceFactor = 0.7 + 0.6 * Math.random();

        var _eventData$products$j = eventData.products[j],
            item = _eventData$products$j.item,
            qty = _eventData$products$j.qty,
            price = _eventData$products$j.price;


        products.push({
          item: item,
          qty: qty,
          price: Math.round(price * priceFactor)
        });
      }

      this.ui.showShop(products);
    }
  }, {
    key: 'attackEvent',
    value: function attackEvent(eventData) {
      var firepower = Math.round((0.7 + 0.6 * Math.random()) * ENEMY_FIREPOWER_AVG);
      var gold = Math.round((0.7 + 0.6 * Math.random()) * ENEMY_GOLD_AVG);

      this.ui.showAttack(firepower, gold);
    }
  }]);

  return Event;
}();

exports.default = Event;

},{"./constants":6,"./eventTypes":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Caravan = require('./Caravan');

var _Caravan2 = _interopRequireDefault(_Caravan);

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _UI = require('./UI');

var _UI2 = _interopRequireDefault(_UI);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GAME_SPEED = _constants2.default.GAME_SPEED,
    DAY_PER_STEP = _constants2.default.DAY_PER_STEP,
    FINAL_DISTANCE = _constants2.default.FINAL_DISTANCE,
    EVENT_PROBABILITY = _constants2.default.EVENT_PROBABILITY;

var Game = function () {
  function Game() {
    _classCallCheck(this, Game);

    this.ui = new _UI2.default();
    this.eventManager = new _Event2.default();
    this.caravan = new _Caravan2.default({
      day: 0,
      distance: 0,
      crew: 30,
      food: 80,
      oxen: 2,
      money: 300,
      firepower: 2
    });

    this.caravan.ui = this.ui;
    this.caravan.eventManager = this.eventManager;

    this.ui.game = this;
    this.ui.caravan = this.caravan;
    this.ui.eventManager = this.eventManager;

    this.eventManager.game = this;
    this.eventManager.caravan = this.caravan;
    this.eventManager.ui = this.ui;

    this.startJourney();
  }

  _createClass(Game, [{
    key: 'startJourney',
    value: function startJourney() {
      this.gameActive = true;
      this.previousTime = null;
      this.ui.notify('A great adventure begins', 'positive');

      this.step();
    }
  }, {
    key: 'step',
    value: function step(timestamp) {
      if (!this.previousTime) {
        this.previousTime = timestamp;
        this.updateGame();
      }

      var progress = timestamp - this.previousTime;

      if (progress >= GAME_SPEED) {
        this.previousTime = timestamp;
        this.updateGame();
      }

      if (this.gameActive) window.requestAnimationFrame(this.step.bind(this));
    }
  }, {
    key: 'updateGame',
    value: function updateGame() {
      this.caravan.day += DAY_PER_STEP;
      this.caravan.consumeFood();

      if (this.caravan.food === 0) {
        this.ui.notify('Your caravan starved to death', 'negative');
        this.gameActive = false;
        return;
      }

      this.caravan.updateWeight();
      this.caravan.updateDistance();

      this.ui.refreshStats();

      if (this.caravan.crew <= 0) {
        this.caravan.crew = 0;
        this.ui.notify('Everyone died', 'negative');
        this.gameActive = false;
        return;
      }

      if (this.caravan.distance >= FINAL_DISTANCE) {
        this.ui.notify('You have returned home!', 'positive');
        this.gameActive = false;
        return;
      }

      if (Math.random() <= EVENT_PROBABILITY) {
        this.eventManager.generateEvent();
      }
    }
  }, {
    key: 'pauseJourney',
    value: function pauseJourney() {
      this.gameActive = false;
    }
  }, {
    key: 'resumeJourney',
    value: function resumeJourney() {
      this.gameActive = true;
      this.step();
    }
  }]);

  return Game;
}();

exports.default = Game;

},{"./Caravan":1,"./Event":2,"./UI":4,"./constants":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UI = function () {
  function UI() {
    _classCallCheck(this, UI);
  }

  _createClass(UI, [{
    key: 'notify',
    value: function notify(message, type) {
      console.log(message + ' - ' + type);
    }
  }, {
    key: 'refreshStats',
    value: function refreshStats() {
      console.log(this.caravan);
    }
  }, {
    key: 'showAttack',
    value: function showAttack(firepower, gold) {
      this.firepower = firepower;
      this.gold = gold;

      document.querySelector('#attack-window').classList.remove('hidden');

      if (!this.attackInitiated) {
        document.getElementById('fight').addEventListener('click', this.fight.bind(this));
        document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

        this.attackInitiated = true;
      }
    }
  }, {
    key: 'fight',
    value: function fight() {
      var firepower = this.firepower;
      var gold = this.gold;
      var damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.caravan.firepower));

      if (damage < this.caravan.crew) {
        this.caravan.crew -= damage;
        this.caravan.money += gold;
        this.notify(damage + ' people were killed fighting', 'negative');
        this.notify('Found $' + gold, 'gold');
      } else {
        this.caravan.crew = 0;
        this.notify('Everybody died in the fight', 'negative');
      }

      document.querySelector('#attack-window').classList.add('hidden');
      this.game.resumeJourney();
    }
  }, {
    key: 'runaway',
    value: function runaway() {
      var firepower = this.firepower;
      var damage = Math.ceil(Math.max(0, firepower * Math.random() / 2));

      if (damage < this.caravan.crew) {
        this.caravan.crew -= damage;
        this.notify(damage + ' people were killed running', 'negative');
      } else {
        this.caravan.crew = 0;
        this.notify('Everybody died running away', 'negative');
      }

      document.querySelector('#attack-window').classList.add('hidden');
      this.game.resumeJourney();
    }
  }, {
    key: 'showShop',
    value: function showShop(products) {
      var self = this;
      var shopWrap = document.querySelector('#shop-window .wrap');

      shopWrap.innerHTML = '';

      products.forEach(function (product) {
        var item = product.item,
            qty = product.qty,
            price = product.price;

        var btnProduct = document.createElement('button');

        btnProduct.classList.add('product');
        btnProduct.setAttribute('data-item', item);
        btnProduct.setAttribute('data-qty', qty);
        btnProduct.setAttribute('data-price', price);
        btnProduct.textContent = qty + ' ' + item + ' - $' + price;

        btnProduct.addEventListener('click', function () {
          self.buyProduct({ item: item, qty: qty, price: price });
        });

        document.querySelector('#shop-window .wrap').appendChild(btnProduct);
      });

      document.querySelector('#shop-window').classList.remove('hidden');

      if (!this.shopInitiated) {
        document.getElementById('exit').addEventListener('click', this.exitShop.bind(this));

        this.shopInitiated = true;
      }
    }
  }, {
    key: 'exitShop',
    value: function exitShop() {
      document.querySelector('#shop-window').classList.add('hidden');
      this.game.resumeJourney();
    }
  }, {
    key: 'buyProduct',
    value: function buyProduct(product) {
      if (product.price > this.caravan.money) {
        this.notify('Not enough money', 'negative');
        return false;
      }

      this.caravan.money -= product.price;
      this.caravan[product.item] += +product.qty;
      this.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');
      this.caravan.updateWeight();
      this.refreshStats();
    }
  }]);

  return UI;
}();

exports.default = UI;

},{}],5:[function(require,module,exports){
'use strict';

var _Game = require('./Game');

var _Game2 = _interopRequireDefault(_Game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _Game2.default();

},{"./Game":3}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  WEIGHT_PER_OX: 20,
  WEIGHT_PER_PERSON: 2,
  FOOD_WEIGHT: 0.6,
  FIREPOWER_WEIGHT: 5,
  GAME_SPEED: 800,
  DAY_PER_STEP: 0.2,
  FOOD_PER_PERSON: 0.02,
  FULL_SPEED: 5,
  SLOW_SPEED: 3,
  FINAL_DISTANCE: 1000,
  EVENT_PROBABILITY: 0.15,
  ENEMY_FIREPOWER_AVG: 5,
  ENEMY_GOLD_AVG: 50
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [{
  type: 'STAT-CHANGE',
  notification: 'negative',
  stat: 'crew',
  value: -3,
  text: 'Food intoxication. Casualties: '
}, {
  type: 'STAT-CHANGE',
  notification: 'negative',
  stat: 'crew',
  value: -4,
  text: 'Flu outbreak. Casualties: '
}, {
  type: 'STAT-CHANGE',
  notification: 'negative',
  stat: 'food',
  value: -10,
  text: 'Worm infestation. Food lost: '
}, {
  type: 'STAT-CHANGE',
  notification: 'negative',
  stat: 'money',
  value: -50,
  text: 'Pick pockets steal $'
}, {
  type: 'STAT-CHANGE',
  notification: 'negative',
  stat: 'oxen',
  value: -1,
  text: 'Ox flu outbreak. Casualties: '
}, {
  type: 'STAT-CHANGE',
  notification: 'positive',
  stat: 'food',
  value: 20,
  text: 'Found wild berries. Food added: '
}, {
  type: 'STAT-CHANGE',
  notification: 'positive',
  stat: 'food',
  value: 20,
  text: 'Found wild berries. Food added: '
}, {
  type: 'STAT-CHANGE',
  notification: 'positive',
  stat: 'oxen',
  value: 1,
  text: 'Found wild oxen. New oxen: '
}, {
  type: 'SHOP',
  notification: 'neutral',
  text: 'You have found a shop',
  products: [{ item: 'food', qty: 20, price: 50 }, { item: 'oxen', qty: 1, price: 200 }, { item: 'firepower', qty: 2, price: 50 }, { item: 'crew', qty: 5, price: 80 }]
}, {
  type: 'SHOP',
  notification: 'neutral',
  text: 'You have found a shop',
  products: [{ item: 'food', qty: 30, price: 50 }, { item: 'oxen', qty: 1, price: 200 }, { item: 'firepower', qty: 2, price: 20 }, { item: 'crew', qty: 10, price: 80 }]
}, {
  type: 'SHOP',
  notification: 'neutral',
  text: 'Smugglers sell various goods',
  products: [{ item: 'food', qty: 20, price: 60 }, { item: 'oxen', qty: 1, price: 300 }, { item: 'firepower', qty: 2, price: 80 }, { item: 'crew', qty: 5, price: 60 }]
}, {
  type: 'ATTACK',
  notification: 'negative',
  text: 'Bandits are attacking you'
}, {
  type: 'ATTACK',
  notification: 'negative',
  text: 'Bandits are attacking you'
}, {
  type: 'ATTACK',
  notification: 'negative',
  text: 'Bandits are attacking you'
}];

},{}]},{},[5]);
