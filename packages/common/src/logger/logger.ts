import { _, COLOR, LEVEL} from './constants';

export class Logger {
    constructor(private section?: string) { }

    private format(level: LEVEL, color: string,  message: any): string {
        const date = new Date().getTime();
        return `${color}[${date}] [${level}] ${this.section ? `${this.section}` : ''} - ${message}${_.reset}`;
    }

    private print(message: string): void {
        process.stdout.write(`${message}\n`);
    }

    public info(message: string): void {
        this.print(this.format(LEVEL.info, COLOR.white, message));
    }

    public warning(message: string): void {
        this.print(this.format(LEVEL.warning, COLOR.yellow, message));
    }

    public error(message: string): void {
        this.print(this.format(LEVEL.error, COLOR.red, message));
    }
}