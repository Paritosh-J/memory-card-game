import Vue from "vue";
import App from "./App.vue";

let app = new Vue({
  el: "#app",
  data: {
    cards: [
      {
        name: "Google",
        img: "google.png",
      },
      {
        name: "Microsoft",
        img: "microsoft.png",
      },
      {
        name: "Apple",
        img: "apple.png",
      },
      {
        name: "Amazon",
        img: "amazon.png",
      },
      {
        name: "AMD",
        img: "amd.png",
      },
      {
        name: "NVIDIA",
        img: "nvidia.png",
      },
    ],

    created() {
      this.cards.forEach((card) => {
        Vue.set(card, "isFlipped", false);
      });

      var cards1 = _.cloneDeep(this.cards);
      var cards2 = _.cloneDeep(this.cards);
      this.memoryCards = this.memoryCards.concat(cards1, cards2);

      this.memoryCards = _.shuffle(
        this.memoryCards.concat(
          _.cloneDeep(this.cards),
          _.cloneDeep(this.cards)
        )
      );
      this.cards.forEach((card) => {
        Vue.set(card, "isFlipped", false);
        Vue.set(card, "isMatched", false);
      });
      this.reset();
    },

    methods: {
      flipCard(card) {
        card.isFlipped = true;
        if (this.flippedCards.length < 2) this.flippedCards.push(card);
        if (this.flippedCards.length === 2) this._match(card);
        if (card.isMatched || card.isFlipped || this.flippedCards.length === 2)
          return;
        if (!this.start) this._startGame();
        card.isFlipped = true;
        if (this.flippedCards.length < 2) this.flippedCards.push(card);
        if (this.flippedCards.length === 2) this._match(card);
      },

      _match(card) {
        this.turns++;
        if (this.flippedCards[0].name === this.flippedCards[1].name) {
          setTimeout(() => {
            this.flippedCards.forEach((card) => (card.isMatched = true));
            this.flippedCards = [];
            if (this.memoryCards.every((card) => card.isMatched === true)) {
              clearInterval(this.interval);
              this.finish = true;
            }
          }, 400);
        } else {
          setTimeout(() => {
            this.flippedCards.forEach((card) => {
              card.isFlipped = false;
            });
            this.flippedCards = [];
          }, 700);
        }
      },

      _startGame() {
        this._tick();
        this.interval = setInterval(this._tick, 1000);
        this.start = true;
      },

      _tick() {
        if (this.totalTime.seconds !== 59) {
          this.totalTime.seconds++;
          return;
        }
        this.totalTime.minutes++;
        this.totalTime.seconds = 0;
      },

      reset() {
        clearInterval(this.interval);

        this.cards.forEach((card) => {
          Vue.set(card, "isFlipped", false);
          Vue.set(card, "isMatched", false);
        });

        setTimeout(() => {
          this.memoryCards = [];
          this.memoryCards = _.shuffle(
            this.memoryCards.concat(
              _.cloneDeep(this.cards),
              _.cloneDeep(this.cards)
            )
          );
          this.totalTime.minutes = 0;
          this.totalTime.seconds = 0;
          this.start = false;
          this.finish = false;
          this.turns = 0;
          this.flippedCards = [];
        }, 600);
      },
    },

    memoryCards: [],

    flippedCards: [],

    finish: false,

    start: false,
    turns: 0,
    totalTime: {
      minutes: 0,
      seconds: 0,
    },

    computed: {
      sec() {
        if (this.totalTime.seconds < 10) return "0" + this.totalTime.seconds;
        return this.totalTime.seconds;
      },
      min() {
        if (this.totalTime.minutes < 10) return "0" + this.totalTime.minutes;
        return this.totalTime.minutes;
      },
    },
  },

  render: h => h(App),
});
