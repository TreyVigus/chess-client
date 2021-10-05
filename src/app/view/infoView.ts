import { Winner } from "../game/gameLoop";
import { Color } from "../game/models";

export function displayTurn(color: Color) {
    const p = getParagraph();
    if(color === 'white') {
        p.innerText = 'Your move';
    } else {
        p.innerText = 'Computer is thinking';
    }
}

export function displayVictor(winner: Winner) {
    const p = getParagraph();
    if(winner === 'white') {
        p.innerText = 'White wins!';
    } else if (winner === 'black') {
        p.innerText = 'Black wins!';
    } else {
        p.innerText = 'Draw';
    }
}

function getParagraph(): HTMLParagraphElement {
    const infoContainer: HTMLDivElement = document.querySelector('.info')!;
    const oldP = infoContainer.querySelector('p');
    if(oldP) {
        return oldP;
    }

    const newP = document.createElement('p');
    infoContainer.appendChild(newP);
    return newP;
}