
export class Drawing {

    name: string;
    width: number;
    height: number;
    backgroundColor: string;
    types: string[];
    shapes: any[];
    labels: string[];
    png: string;
    instructions: string[];

    constructor(
        name: string, width: number, height: number, backgroundColor: string,
        shapes: any, labels: string[], types: string[], png: string, instructions: string[]) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        this.labels = labels;
        this.png = png;
        this.instructions = instructions;
        try {
            for (const key of shapes.keys()) {
                this.shapes.push(shapes.get(key));
                this.types.push(shapes.get(key).constructor.name);
            }
        } catch (err) {
            this.shapes = shapes;
            this.types = types;
        }

    }
}
