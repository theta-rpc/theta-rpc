import { _, COLORS, LEVELS} from './constants';
import { Renderer } from './renderer';

export class Logger {
    
    private renderer = new Renderer(this.section);

    constructor(private section?: string) { }

    public info(message: string): void {
        this.renderer.render(LEVELS.info, COLORS.green, message)
    }

    public warning(message: string): void {
        this.renderer.render(LEVELS.warning, COLORS.yellow, message);
    }

    public error(message: string): void {
        this.renderer.render(LEVELS.error, COLORS.red, message);
    }
}