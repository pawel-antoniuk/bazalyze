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
        collectionName: string,
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
        selectedView: 'original',
        onUpdateCallback: [],
        views: [{
          viewName: 'original',
          collectionName: file.name,
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
    return db.collections.map(c => c.name);
  }

  public getCollectionEntries(collectionName: string, limit: number) {
    let q = db.getCollection(collectionName).chain().find();
    if (limit > 0) {
      return q.limit(limit).data();
    } else {
      return q.data();
    }
  }

  private getCollectionDefaultViewInfo(collectionName: string) {
    if (collectionName in this.collections) {
      return this.collections[collectionName]
        .views.find(v => v.viewName == this.collections[collectionName].selectedView);
    } else {
      return null;
    }
  }

  public getCollectionDefaultViewColumns(collectionName: string) {
    return this.getCollectionDefaultViewInfo(collectionName)?.columnNames;
  }

  public getCollectionDefaultViewIndices(collectionName: string) {
    const defaultViewCollectionName = this.getCollectionDefaultViewInfo(collectionName).collectionName;
    return Object.keys(db.getCollection(defaultViewCollectionName).binaryIndices);
  }

  public getCollectionDefaultView(collectionName: string) {
    const defaultViewCollectionName = this.getCollectionDefaultViewInfo(collectionName).collectionName;
    return db.getCollection(defaultViewCollectionName);
  }

  public getCollectionViewNames(collectionName: string) {
    return this.collections[collectionName].views.map(v => v.viewName);
  }

  public onCollectionUpdate(collectionName: string, callback: () => void) {
    this.collections[collectionName].onUpdateCallback.push(callback);
  }

  public getCollectionDefaultViewName(collectionName: string) {
    return this.collections[collectionName].selectedView;
  }

  public selecetCollectionView(collectionName: string, collectionViewName: string) {
    this.collections[collectionName].selectedView = collectionViewName;
  }

  public addCollectionView(collectionName: string, collectionViewName: string,
    columnNames: string[], indicies: string[], data: any[]) {

    const newCollectionName = collectionName + '(' + collectionViewName + ')';

    const newCollection = db.addCollection(newCollectionName, {
      indices: indicies
    });
    newCollection.insert(data);

    this.collections[collectionName].views.push({
      viewName: collectionViewName,
      collectionName: newCollectionName,
      columnNames: columnNames
    });
  }

  public removeCllection(collectionName: string) {
    db.removeCollection(collectionName);
    delete this.collections[collectionName];
  }
}
