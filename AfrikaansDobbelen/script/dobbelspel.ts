class Dobbelsteen {
  private _aantalOgen: number;
  constructor() {
    this._aantalOgen = 1;
  }
  get aantalOgen(): number {
    return this._aantalOgen;
  }
  rol(): void {
    this._aantalOgen = Math.floor(Math.random() * 6) + 1;
  }
}

class Speler {
  private _score : number;
  private _dobbelstenen : Dobbelsteen[];
  constructor(private _naam:string) {
    this._score = 0;
    this._dobbelstenen = new Array();
    for (let index = 0; index < 5; index++) {
      this._dobbelstenen.push(new Dobbelsteen());
    }
  }
  get score(): Number {
    return this._score;
  }
  get naam(): String {
    return this._naam;
  }
  get dobbelstenen() {
    return this._dobbelstenen;
  }
  speel() {
    for (const dobbelsteen of this._dobbelstenen) {
      dobbelsteen.rol();
      if (dobbelsteen.aantalOgen === 1) this._score += 100;
      else if (dobbelsteen.aantalOgen === 5) this._score += 50;
    }
  }
}

class Spel {
  private _spelerAanZet : Speler;
  constructor(private _spelers: Speler[]) {
        this._spelerAanZet = _spelers[0];
  }
  get aantalSpelers(): number {
    return this._spelers.length;
  }
  get spelerAanZet():Speler {
    return this._spelerAanZet;
  }
  get heeftWinnaar():boolean {
    for (const speler of this._spelers) {
      if (speler.score >= 1000) return true;
    }
    return false;
  }
  get scoreOverzicht():string {
    let resultaat:string = '';
    for (const speler of this._spelers) {
      resultaat += `${speler.naam}: ${speler.score}\n`;
    }
    return resultaat;
  }
  speel():void {
    if (!this.heeftWinnaar) this._spelerAanZet.speel();
  }
  bepaalVolgendeSpeler():void {
    if (!this.heeftWinnaar) {
      this._spelerAanZet = this._spelers[
        (this._spelers.indexOf(this._spelerAanZet) + 1) % this.aantalSpelers
      ];
    }
  }
}

function toHtml(spel:Spel) {
  let labelSpeler: any = document.getElementById('speler');
  let labelScore: any = document.getElementById('score');
  let labelPlay: any = document.getElementById('play');
  labelSpeler.innerHTML = `Speler aan zet: ${
    spel.spelerAanZet.naam
  }`;
  labelScore.innerHTML = `Score = ${
    spel.spelerAanZet.score
  }`;
  for (let index:number = 0; index < spel.spelerAanZet.dobbelstenen.length; index++) {
    let dobbelsteen: any = document.getElementById((index + 1).toString());
    dobbelsteen.src = `images/Dice${
      spel.spelerAanZet.dobbelstenen[index].aantalOgen
    }.png`;
  }
  if (spel.heeftWinnaar) {
    alert(
      `De winnaar is ${spel.spelerAanZet.naam}. Proficiat!\n${
        spel.scoreOverzicht
      }`
    );
  } else {
    if (labelPlay.value === 'Rol dobbelstenen') {
      labelPlay.value = 'Volgende speler';
      labelPlay.onclick = function() {
        spel.bepaalVolgendeSpeler();
        toHtml(spel);
      };
    } else {
      labelPlay.value = 'Rol dobbelstenen';
      labelPlay.onclick = function() {
        spel.speel();
        toHtml(spel);
      };
    }
  }
}

function init() {
  const aantalSpelers : number = prompt('Met hoeveel spelers gaan we spelen?') as any;
  const spelers: Speler[] = new Array();
  for (let index = 0; index < aantalSpelers; index++) {
    let spelerName: any = prompt(`Geef naam van speler ${index + 1}`);
    spelers.push(new Speler(spelerName));
  }
  const spel: Spel = new Spel(spelers);
  toHtml(spel);
  let btnPlay:any = document.getElementById('play');
  btnPlay.onclick = function() {
    spel.speel();
    toHtml(spel);
  };
  let btnScore:any = document.getElementById('scorebord');
  btnScore.onclick = function() {
    alert(spel.scoreOverzicht);
  };
}

window.onload = init;
