export default class UI {
  constructor() {}

  notify(message, type) {
    console.log('${message} - ${type}')
  }

  refreshStats() {
    console.log(this.caravan);
  }
}