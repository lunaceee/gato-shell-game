"use strict";

import SpriteGroup from "../util/spriteGroup";
import { message } from "../util/message";

const gato = new SpriteGroup();

export { gato };

gato.add(".body", 0, 0);
gato.add(".default-eye-frame", 2, 3);
gato.add(".eye-background", 2.4, 3);
gato.add(".eye-left", 0, 0, 2.5, 2);
gato.add(".eye-right", 0, 0, 2.5, 2);
gato.add(".eye-dots-default-left", 2, 5);
gato.add(".eye-dots-default-right", 9, 5);

gato.add(".shuffling-eye-frame", 2, 3);
gato.add(".shuffling-eyes", 3.9, 4.2);

gato.add(".funky-eye-frame", 2, 3);
gato.add(".funky-eyes", 3.6, 4.1);

gato.add(".shocked-eye-frame", 2, 3);
gato.add(".innocent-eyes", 3.3, 3.5);
gato.add(".shocked-eyes", 3.7, 4.2);
gato.add(".ultra-shocked-eyes", 3.8, 4.2);

gato.add(".tail", 9, 9);
gato.add(".legs-center", 4, 13);
gato.add(".legs-default", 4.5, 13.5);
gato.add(".legs-left", 1.8, 13);
gato.add(".legs-right", 3.7, 13);
gato.add(".mustache", -1, 7.5);
gato.add(".nose-mouth-default", 6.5, 8);
gato.add(".nose-mouth-snarky", 6.5, 8);

export function gatoSnarky(winner) {
    gato.noseMouthDefault.hide();
    gato.showList("noseMouthSnarky innocentEyes shufflingEyeFrame");
    message(`Treat is under shell ${winner}. Gato won and he is unstoppable!`);
}

export function gatoHappy(winner) {
    gato.noseMouthDefault.hide();
    gato.showList("funkyEyes funkyEyeFrame noseMouthSnarky");
    message(`Treat is under shell ${winner}. Gato found it!`);
}

export function gatoPissed(winner) {
    gato.showList(`funkyEyes funkyEyeFrame`);
    message(`Treat is under shell ${winner}. Gato lost and he is pissed!`);
}

export function gatoShocked(winner) {
    gato.showList(`shockedEyes shockedEyeFrame`);
    message(`Treat is under shell ${winner}. Gato lost again?!`);
}

export function gatoSpeechless(winner) {
    gato.showList(`shockedEyeFrame ultraShockedEyes`);
    message(`Treat is under shell ${winner}. ` +
        `Gato lost and he is speechless! @#$!@#$!@#!`);
}