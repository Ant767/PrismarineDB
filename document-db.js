function MergeRecursive(obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if ( obj2[p].constructor==Object ) {
          obj1[p] = MergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;
}

export default class DocumentDB {
    #data;

    constructor() {
        this.#data = [];
    }

    clear() {
        this.#data = [];
        this.save();
    }

    #genID() {
        return Date.now();
    }

    get rawData() {
        return this.#data
    }

    insertDocument(data) {
        this.#data.push({
            id: this.#genID(),
            data,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
        this.save();
    }

    overwriteDataByID(id, data) {
        let docIndex = this.#data.findIndex(document=> document.id == id);
        if(docIndex < 0) return null;
        this.#data[docIndex].data = data;
        this.#data[docIndex].updatedAt = Date.now();
        this.save();
        return data;
    }
    matchesQuery(query, data) {
        if(typeof query === "string" && typeof data === "string") return query == data;
        if(typeof query === "object" && typeof data === "string") {
            if(query.lengthGreaterThan) return data.length > query.lengthGreaterThan
            if(query.lengthLessThan) return data.length > query.lengthLessThan
            return false;
        }
        if(typeof query === "object" && typeof data === "object") {
            if(data.type && data.type == "Date") {
                if(query.after) return new Date(data.timestamp).getTime() > query.after
                if(query.before) return new Date(data.timestamp).getTime() < query.before
                return false;
            } else {
                let unsuccessfulRuns = 0;
                function matchQueryRecursive(query) {
                    for(const key in query) {
                        if(typeof query[key] !== "object") {
                            if(!data[key] || data[key] != query[key]) unsuccessfulRuns++
                        } else if(typeof query[key] === "object") {
                            matchQueryRecursive(query[key]);
                        }
                    }    
                }
                matchQueryRecursive(query);
                return unsuccessfulRuns == 0;
            }
        }
    }
    findDocuments(query) {
        let docs = [];
        for(const doc of this.#data) {
            if(this.matchesQuery(query, doc.data)) docs.push(doc);
        }
        return docs;
    }
    findFirst(query) {
        let docs = this.findDocuments(query);
        if(docs.length) return docs[0];
        return null;
    }
    updateFirstDocumentByQuery(query, data) {
        let doc = this.findFirst(query);
        if(!doc) return false;
        if(typeof data === "object")
            return this.overwriteDataByID(doc.id, MergeRecursive(doc.data, data));
        else
            return this.overwriteDataByID(doc.id, data);
    }
    overwriteFirstDocumentByQuery(query, data) {
        let doc = this.findFirst(query);
        if(!doc) return false;
        return this.overwriteDataByID(doc.id, data);
    }
    deleteDocumentByID(id) {
        let docIndex = this.#data.findIndex(document=> document.id == id);
        if(docIndex < 0) return false;
        this.#data.splice(docIndex, 1);
        this.save();
        return true;
    }
    deleteFirstDocumentByQuery(query) {
        let doc = this.findFirst(query);
        if(!doc) return false;
        return this.deleteDocumentByID(doc.id);
    }
}
