import { world } from '@minecraft/server';
import DocumentDB from './document-db';

class PrismarineDBTable extends DocumentDB {
    constructor(tableName = "default") {
        super();
        this.table = tableName;
        this.data = [];
        this.load();
    }
    load() {
        let val = ``
        try {
            val = world.getDynamicProperty(`prismarine:${this.table}`, [])
        } catch { val = `` }
        if(!val) val = `[]`;
        try {
            this.data = JSON.parse(val);
        } catch {
            this.data = [];
        }
    }
    save() {
        world.setDynamicProperty(`prismarine:${this.table}`, JSON.stringify(this.data));
    }
}

class PrismarineDB {
    table(name) {
        return new PrismarineDBTable(name);
    }
}

export const prismarineDb = new PrismarineDB();
