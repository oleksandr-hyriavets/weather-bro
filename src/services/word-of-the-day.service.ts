import { IMessageable } from "../interfaces/messageable.interface";

const wordsDictionary = {
    'dzień': 'день',
    'samohód': 'автомобіль'
}

type WordOfTheDayReturnType = {
    polish: string;
    ukranian: string;
}

export class WordOfTheDayService implements IMessageable {
    async getMessage(): Promise<string> {
        const word = await this.getWordOfTheDay();
        return `The word of the day: ${word.polish} - ${word.ukranian}`
    }

    private async getWordOfTheDay(): Promise<WordOfTheDayReturnType> {
        const polish = this.getRandomKeyFromDictionary(wordsDictionary);

        return {
            polish,
            ukranian: wordsDictionary[polish],
        }
    }

    private getRandomKeyFromDictionary<T extends Object>(dictionary: T): keyof T {
        const keys = Object.keys(dictionary);
        const randIndex = Math.random() * 1000 % keys.length;

        return keys[randIndex] as keyof T
    }
}