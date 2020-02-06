class Dobbelsteen {
	private _aantalOgen = 1;

	get aantalOgen(): number {
		return this._aantalOgen;
	}
	rol(): void {
		this._aantalOgen = Math.floor(Math.random() * 6) + 1;
	}
}

class Speler {
	private _score = 0;
	private _dobbelstenen: Dobbelsteen[] = [];
	constructor(private _naam: string) {
		for (let index = 0; index < 5; index++) {
			this._dobbelstenen.push(new Dobbelsteen());
		}
	}
	get score(): number {
		return this._score;
	}
	get naam(): string {
		return this._naam;
	}
	get dobbelstenen(): Dobbelsteen[] {
		return this._dobbelstenen;
	}
	speel(): void {
		this._dobbelstenen.forEach((dobbelsteen: Dobbelsteen) => {
			dobbelsteen.rol();
			if (dobbelsteen.aantalOgen === 1) this._score += 100;
			else if (dobbelsteen.aantalOgen === 5) this._score += 50;
		});
	}
}

class Spel {
	private _spelerAanZet: Speler;

	constructor(private _spelers: Speler[]) {
		this._spelerAanZet = _spelers[0];
	}
	get aantalSpelers(): number {
		return this._spelers.length;
	}
	get spelerAanZet(): Speler {
		return this._spelerAanZet;
	}
	get heeftWinnaar(): boolean {
		return (
			this._spelers.filter((speler: Speler) => speler.score >= 1000).length > 0
		);
	}
	get scoreOverzicht(): string {
		let resultaat = '';
		this._spelers.forEach((speler: Speler) => {
			resultaat += `${speler.naam}: ${speler.score}\n`;
		});
		return resultaat;
	}
	speel(): void {
		if (!this.heeftWinnaar) this._spelerAanZet.speel();
	}
	bepaalVolgendeSpeler(): void {
		if (!this.heeftWinnaar) {
			this._spelerAanZet = this._spelers[
				(this._spelers.indexOf(this._spelerAanZet) + 1) % this.aantalSpelers
			];
		}
	}
}

function toHtml(spel: Spel) {
	const labelSpeler: HTMLSpanElement = document.getElementById('speler')!;
	const labelScore: HTMLSpanElement = document.getElementById('score')!;
	const labelPlay: HTMLInputElement = document.getElementById(
		'play'
	)! as HTMLInputElement;

	labelSpeler.innerHTML = `Speler aan zet: ${spel.spelerAanZet.naam}`;
	labelScore.innerHTML = `Score = ${spel.spelerAanZet.score}`;
	spel.spelerAanZet.dobbelstenen.forEach(
		(dobbelsteen: Dobbelsteen, index: number) => {
			const dobbelsteenLabel: HTMLImageElement = <HTMLImageElement>(
				document.getElementById((index + 1).toString())!
			);
			dobbelsteenLabel.src = `images/Dice${dobbelsteen.aantalOgen}.png`;
		}
	);

	if (spel.heeftWinnaar) {
		alert(
			`De winnaar is ${spel.spelerAanZet.naam}. Proficiat!\n${spel.scoreOverzicht}`
		);
	} else {
		if (labelPlay.value === 'Rol dobbelstenen') {
			labelPlay.value = 'Volgende speler';
			labelPlay.onclick = () => {
				spel.bepaalVolgendeSpeler();
				toHtml(spel);
			};
		} else {
			labelPlay.value = 'Rol dobbelstenen';
			labelPlay.onclick = () => {
				spel.speel();
				toHtml(spel);
			};
		}
	}
}

function init() {
	const aantalSpelers: number = prompt(
		'Met hoeveel spelers gaan we spelen?'
	) as any;
	const spelers: Speler[] = [];
	for (let index = 0; index < aantalSpelers; index++) {
		const spelerName: string = prompt(`Geef naam van speler ${index + 1}`)!;
		spelers.push(new Speler(spelerName));
	}
	const spel = new Spel(spelers);
	toHtml(spel);

	document.getElementById('play')!.onclick = function() {
		spel.speel();
		toHtml(spel);
	};
	document.getElementById('scorebord')!.onclick = function() {
		alert(spel.scoreOverzicht);
	};
}

window.onload = init;
