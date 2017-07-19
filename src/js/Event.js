import eventTypes from './eventTypes';
import constants from './constants';

const { ENEMY_FIREPOWER_AVG, ENEMY_GOLD_AVG } = constants;

export default class Event {
  constructor() {}

  generateEvent() {
    const eventIndex = Math.floor(Math.random() * eventTypes.length);
    const eventData = eventTypes[eventIndex];

    if (eventData.type == 'STAT-CHANGE') {
      this.stateChangeEvent(eventData);
    }
    else if (eventData.type == 'SHOP') {
      this.game.pauseJourney();
      this.ui.notify(eventData.text, eventData.notification);
      this.shopEvent(eventData);
    }

    else if (eventData.type == 'ATTACK') {
      this.game.pauseJourney();
      this.ui.notify(eventData.text, eventData.notification);
      this.attackEvent(eventData);
    }
  }

  stateChangeEvent(eventData) {
    if (eventData.value + this.caravan[eventData.stat] >= 0) {
      this.caravan[eventData.stat] += eventData.value;
      this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
    }
  }

  shopEvent(eventData) {
    let products = [], j, priceFactor;
    const numProds = Math.ceil(Math.random() * 4);

    for(let i = 0; i < numProds; i++) {
      j = Math.floor(Math.random() * eventData.products.length);
      priceFactor = 0.7 + 0.6 * Math.random();

      const { item, qty, price } = eventData.products[j];

      products.push({ 
        item, 
        qty,
        price: Math.round(price * priceFactor)
      });
    }

    this.ui.showShop(products);
  }

  attackEvent(eventData) {
    const firepower = Math.round((0.7 + 0.6 * Math.random()) * ENEMY_FIREPOWER_AVG);
    const gold = Math.round((0.7 + 0.6 * Math.random()) * ENEMY_GOLD_AVG);

    this.ui.showAttack(firepower, gold);
  }
}