import { LEVELS } from "./constants";
import { _ } from './constants';

export class Renderer {
    constructor(private section?: string) { }

    private currentDate() {
        return new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
    }

    private format(level: LEVELS, color: string, message: string): string {
        const currentDate = this.currentDate();
        return `${color}[${currentDate}] [${level}] ${this.section ? `${this.section}` : ''} - ${message}${_.reset}`;
    }

    private print(message: string) {
        process.stdout.write(message + '\n');
    }

    public render(level: LEVELS, color: string, message: string) {
        this.print(this.format(level, color, message));
    }
}