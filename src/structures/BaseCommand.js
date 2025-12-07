// structures/BaseCommand.js
// Esta é uma classe base para criar comandos customizados

export class BaseCommand {
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }

    toJSON() {
        return this.data.toJSON();
    }
}

export default BaseCommand;
