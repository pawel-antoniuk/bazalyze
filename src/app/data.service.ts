import { Injectable } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import loki, { Collection, LokiFsAdapter } from 'lokijs';

let db: loki = new loki('db.json');

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private collections: {
    [id: string]: {
      selectedView: string,
      onUpdateCallback: (() => void)[],
      views: {
        viewName: string,
        columnNames: string[],
      }[]
    }
  } = {};

  constructor(private papa: Papa) { }

  public loadData(file: File,
    indicesSelector: (headers: string[],
      save: (indicies: string[], complete: (collectionName: string) => void) => void) => void) {

    let parseResult: ParseResult;

    const previousCollection = db.getCollection(file.name);
    if (previousCollection != null) {
      db.removeCollection(file.name);
    }

    let save = (indicies: string[],
      complete: (collectionName: string) => void) => {

      let collection: Collection = db.addCollection(file.name, {
        indices: indicies
      });

      collection.insert(parseResult.data);

      this.collections[file.name] = {
        selectedView: file.name,
        onUpdateCallback: [],
        views: [{
          viewName: file.name,
          columnNames: parseResult.meta.fields
        }]
      };

      parseResult = null;

      complete(collection.name);
    };

    this.papa.parse(file, {
      complete: (result) => {
        parseResult = result;
        indicesSelector(result.meta.fields, save);
      },
      transformHeader: (header) => header === '' ? 'ID' : header,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
  }

  public getCollectionNames() {
    return Object.keys(this.collections);
  }

  public getViewNames(): string[] {
    let viewNames: string[] = [];
    for (let [_, value] of Object.entries(this.collections)) {
      viewNames.push(...value.views.map(v => v.viewName));
    }

    return viewNames;
  }

  public getCollectionViewNames(collectionName: string) {
    return this.collections[collectionName].views.map(v => v.viewName);
  }

  public getViewNameCollection(viewName: string) {
    for(let [collectionName, collectionValue] of Object.entries(this.collections)) {
      let foundView = collectionValue.views.find(v => v.viewName == viewName);
      if(foundView) {
        return collectionName;
      }
    }
  }

  public getViewEntries(viewName: string, limit: number) {
    let q = db.getCollection(viewName).chain().find();
    if (limit > 0) {
      return q.limit(limit).data();
    } else {
      return q.data();
    }
  }

  public getViewColumns(viewName: string) {
    for (let collection of Object.values(this.collections)) {
      const view = collection.views.find(v => v.viewName == viewName);
      if (view) {
        return view.columnNames;
      }
    }
  }

  public getViewIndices(viewName: string) {
    return Object.keys(db.getCollection(viewName).binaryIndices);
  }

  public getView(viewName: string) {
    return db.getCollection(viewName);
  }

  // public getCollectionViewNames(collectionName: string) {
  //   return this.collections[collectionName].views.map(v => v.viewName);
  // }

  public onCollectionUpdate(collectionName: string, callback: () => void) {
    this.collections[collectionName].onUpdateCallback.push(callback);
  }

  public getCollectionSelectedViewName(collectionName: string) {
    return this.collections[collectionName].selectedView;
  }

  public selecetCollectionView(collectionName: string, viewName: string) {
    this.collections[collectionName].selectedView = viewName;
  }

  public addCollectionView(collectionName: string, viewName: string,
    columnNames: string[], indicies: string[], data: any[]) {

    const newCollection = db.addCollection(viewName, {
      indices: indicies
    });
    newCollection.insert(data);

    this.collections[collectionName].views.push({
      viewName: viewName,
      columnNames: columnNames
    });
  }

  public removeCllection(collectionName: string) {
    db.removeCollection(collectionName);
    delete this.collections[collectionName];
  }

  public collectionUpdated(collectionName: string) {
    this.collections[collectionName].onUpdateCallback.forEach(c => c());
  }
}
