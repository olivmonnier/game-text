export default class UI {
  constructor() {}

  notify(message, type) {
    console.log(`${message} - ${type}`)
  }

  refreshStats() {
    console.log(this.caravan);
  }

  showAttack(firepower, gold) {
    this.firepower = firepower;
    this.gold = gold;

    document.querySelector('#attack-window').classList.remove('hidden');

    if (!this.attackInitiated) {
      document.getElementById('fight').addEventListener('click', this.fight.bind(this));
      document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

      this.attackInitiated = true;
    }
  }

  fight() {
    const firepower = this.firepower;
    const gold = this.gold;
    const damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.caravan.firepower));

    if (damage < this.caravan.crew) {
      this.caravan.crew -= damage;
      this.caravan.money += gold;
      this.notify(damage + ' people were killed fighting', 'negative');
      this.notify('Found $' + gold, 'gold');
    }
    else {
      this.caravan.crew = 0;
      this.notify('Everybody died in the fight', 'negative');
    }

    document.querySelector('#attack-window').classList.add('hidden');
    this.game.resumeJourney();
  }

  runaway() {
    const firepower = this.firepower;
    const damage = Math.ceil(Math.max(0, firepower * Math.random()/2));

    if (damage < this.caravan.crew) {
      this.caravan.crew -= damage;
      this.notify(damage + ' people were killed running', 'negative');
    }
    else {
      this.caravan.crew = 0;
      this.notify('Everybody died running away', 'negative');
    }

    document.querySelector('#attack-window').classList.add('hidden');
    this.game.resumeJourney();
  }

  showShop(products) {
    const self = this;
    const shopWrap = document.querySelector('#shop-window .wrap');

    shopWrap.innerHTML = '';  

    products.forEach(product => {
      const { item, qty, price } = product;
      const btnProduct = document.createElement('button');

      btnProduct.classList.add('product');
      btnProduct.setAttribute('data-item', item);
      btnProduct.setAttribute('data-qty', qty);
      btnProduct.setAttribute('data-price', price);
      btnProduct.textContent = `${qty} ${item} - $${price}`;

      btnProduct.addEventListener('click', () => {
        self.buyProduct({ item, qty, price })
      });

      document.querySelector('#shop-window .wrap').appendChild(btnProduct);
    });

    document.querySelector('#shop-window').classList.remove('hidden');

    if (!this.shopInitiated) {
      document.getElementById('exit').addEventListener('click', this.exitShop.bind(this));

      this.shopInitiated = true;
    }
  }

  exitShop() {
    document.querySelector('#shop-window').classList.add('hidden');
    this.game.resumeJourney();
  }

  buyProduct(product) {
    if (product.price > this.caravan.money) {
      this.notify('Not enough money', 'negative');
      return false;
    }

    this.caravan.money -= product.price;
    this.caravan[product.item] += +product.qty;
    this.notify(`Bought ${product.qty} x ${product.item}`, 'positive');
    this.caravan.updateWeight();
    this.refreshStats();
  }
}