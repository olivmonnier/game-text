import { WEIGHT_PER_OX, WEIGHT_PER_PERSON, FOOD_WEIGHT, FIREPOWER_WEIGHT, SLOW_SPEED, FULL_SPEED, FOOD_PER_PERSON } from './constants';

export default class Caravan {
  constructor(stats) {
    this.day = stats.day;
    this.distance = stats.distance;
    this.crew = stats.crew;
    this.food = stats.food;
    this.oxen = stats.oxen;
    this.money = stats.money;
    this.firepower = stats.firepower; 
  }

  updateWeight() {
    let droppedFood = 0, droppedGuns = 0;

    this.capacity = this.oxen * WEIGHT_PER_OX + this.crew * WEIGHT_PER_PERSON;
    this.weight = this.food * FOOD_WEIGHT + this.firepower * FIREPOWER_WEIGHT;

    while(this.firepower && this.capacity <= this.weight) {
      this.firepower--;
      this.weight -= FIREPOWER_WEIGHT;
      droppedGuns++;
    }

    if (droppedGuns) {
      this.ui.notify('Left ${droppedFood} food provisions behind', 'negative');
    }
  }

  updateDistance() {
    const diff = this.capacity - this.weight;
    const speed = SLOW_SPEED + diff / this.capacity * FULL_SPEED;

    this.distance += speed;
  }

  consumeFood() {
    this.food -= this.crew * FOOD_PER_PERSON;

    if (this.food < 0) {
      this.food = 0;
    }
  }
}