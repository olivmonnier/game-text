import Caravan from './Caravan';
import Event from './Event';
import UI from './UI';
import constants from './constants';

const { GAME_SPEED, DAY_PER_STEP, FINAL_DISTANCE, EVENT_PROBABILITY } = constants;

export default class Game {
  constructor() {
    this.ui = new UI();
    this.eventManager = new Event();
    this.caravan = new Caravan({
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

  startJourney() {
    this.gameActive = true;
    this.previousTime = null;
    this.ui.notify('A great adventure begins', 'positive');

    this.step();
  }

  step(timestamp) {
    if(!this.previousTime){
      this.previousTime = timestamp;
      this.updateGame();
    }

    const progress = timestamp - this.previousTime;

    if(progress >= GAME_SPEED) {
      this.previousTime = timestamp;
      this.updateGame();
    }

    if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
  }

  updateGame() {
    this.caravan.day += DAY_PER_STEP;
    this.caravan.consumeFood();

    if(this.caravan.food === 0) {
      this.ui.notify('Your caravan starved to death', 'negative');
      this.gameActive = false;
      return;
    }

    this.caravan.updateWeight();
    this.caravan.updateDistance();

    this.ui.refreshStats();

    if(this.caravan.crew <= 0) {
      this.caravan.crew = 0;
      this.ui.notify('Everyone died', 'negative');
      this.gameActive = false;
      return;
    }

    if(this.caravan.distance >= FINAL_DISTANCE) {
      this.ui.notify('You have returned home!', 'positive');
      this.gameActive = false;
      return;
    }

    if(Math.random() <= EVENT_PROBABILITY) {
      this.eventManager.generateEvent();
    }
  }

  pauseJourney() {
    this.gameActive = false;
  }

  resumeJourney() {
    this.gameActive = true;
    this.step();
  }
}