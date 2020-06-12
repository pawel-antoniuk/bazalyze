import { Injectable } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import loki, { Collection, LokiFsAdapter } from 'lokijs';

let db: loki = new loki('db.json');

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private columnNames: {[id: string]: string[]} = {};

  constructor(private papa: Papa) { }

  public loadData(file: File,
    selector: (headers: string[],
      save: (indicies: string[], complete: (collectionName: string) => void) => void) => void) {

    let parseResult: ParseResult;

    let save = (indicies: string[], complete: (collectionName: string) => void) => {
      let collection: Collection = db.addCollection(file.name, {
        indices: indicies
      });
      collection.insert(parseResult.data);
      db.saveDatabase();

      complete(collection.name);
    };

    this.papa.parse(file, {
      complete: (result) => {
        parseResult = result;
        this.columnNames[file.name] = result.meta.fields;
        selector(result.meta.fields, save);
      },
      header: true,
    });
  }

  public getCollectionNames() {
    return db.collections.map(c => c.name);
  }

  public getCollectionEntries(collectionName: string, limit: number) {
    let q = db.getCollection(collectionName).chain().find();
    if(limit > 0) {
      return q.limit(limit).data();
    } else {
      return q.data();
    }
  }

  public getCollectionColumns(collectionName: string) {
    return this.columnNames[collectionName];
  }
}
