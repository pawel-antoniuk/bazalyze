import { Injectable } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import loki, { Collection } from 'lokijs';

let db: loki = new loki('db.json');

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private collections: {
    [id: string]: {
      onUpdateCallback: (() => void)[],
      views: {
        viewName: string,
        columnNames: string[],
      }[],
      handles: number
    }
  } = {};

  constructor(private papa: Papa) { }

  public loadDataFromFile(file: File, hasHeader: boolean,
    indicesSelector: (headers: string[],
      save: (indicies: string[], complete: (collectionName: string) => void) => void) => void) {

    let fileName = file.name.split('.')[0];
    let parseResult: ParseResult;

    const collectionName = this.generateCollectionName(fileName);

    this.papa.parse(file, {
      complete: (result) => {
        parseResult = result;

        let header: string[];
        if (result.meta.fields === undefined) {
          header = Array.from(
            { length: result.data[0].length - 1 },
            (x, i) => i.toString()
          );
        } else {
          header = result.meta.fields;
        }

        indicesSelector(header, (indicies: string[],
          complete: (collectionName: string) => void) => {
          this.addCollection(collectionName, indicies, header, parseResult.data);
          parseResult = null;
          complete(collectionName);
        });
      },
      transformHeader: (header) => header === '' ? 'ID' : header,
      header: hasHeader,
      skipEmptyLines: true,
      dynamicTyping: true,
      comments: "#"
    });
  }

  public loadDataFromAssets(assetName: string,
    indicesSelector: (headers: string[],
      save: (indicies: string[], complete: (collectionName: string) => void) => void) => void) {

    let fileName = assetName.split('.')[0];
    let parseResult: ParseResult;

    const collectionName = this.generateCollectionName(fileName);

    let save = (indicies: string[],
      complete: (collectionName: string) => void) => {

      this.addCollection(collectionName, indicies, parseResult.meta.fields, parseResult.data);
      parseResult = null;
      complete(collectionName);
    };

    fetch(`assets/${assetName}`).then(r => r.text()).then(data => {
      this.papa.parse(data, {
        complete: (result) => {
          parseResult = result;
          indicesSelector(result.meta.fields, save);
        },
        transformHeader: (header) => header === '' ? 'ID' : header,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });
    });
  }

  private generateCollectionName(datasetName: string) {
    let previousCollection = db.getCollection(datasetName);
    if (previousCollection == null) {
      return datasetName;
    }

    let i: number;
    for (i = 2; ; ++i) {
      previousCollection = db.getCollection(`${datasetName} ${i}`);
      if (previousCollection == null) {
        break;
      }
    }

    return `${datasetName} ${i}`;
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
    for (let [collectionName, collectionValue] of Object.entries(this.collections)) {
      let foundView = collectionValue.views.find(v => v.viewName == viewName);
      if (foundView) {
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

  public addCollection(collectionName: string, indices: string[], columnNames: string[], data: any[]) {
    let collection: Collection = db.addCollection(collectionName, {
      indices: indices
    });

    if(Array.isArray(data[0])) {
      data = data.map(row => {
        let obj = {};
        for(let i = 0; i < row.length; ++i) {
          obj[i.toString()] = row[i];
        }
        return obj;
      });
    }

    collection.insert(data);

    this.collections[collectionName] = {
      onUpdateCallback: [],
      views: [{
        viewName: collectionName,
        columnNames: columnNames
      }],
      handles: 1
    };
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

  public removeView(viewName: string) {
    Object.entries(this.collections).forEach(([cName, c]) => {
      const foundIndex = c.views.findIndex(v => v.viewName == viewName);
      if (foundIndex != -1) {
        db.removeCollection(c.views[foundIndex].viewName);
        c.views.splice(foundIndex, 1);
        this.collectionUpdated(cName);
      }
    });
  }

  public addCollectionHandle(collectionName: string) {
    this.collections[collectionName].handles += 1;
  }

  public removeCollectionHandle(collectionName: string) {
    this.collections[collectionName].handles -= 1;

    if (this.collections[collectionName].handles <= 0) {
      this.collections[collectionName].views.forEach(v => db.removeCollection(v.viewName));
      db.removeCollection(collectionName);
      delete this.collections[collectionName];
    }
  }

  public collectionUpdated(collectionName: string) {
    this.collections[collectionName].onUpdateCallback.forEach(c => c());
  }

  public updateViewColumnNames(viewName: string) {
    const newColumnNames = Object.keys(this.getView(viewName).findOne());
    let oldColumnNames = this.getViewColumns(viewName);
    const filtredColumnNames = newColumnNames.filter(n => !['meta', '$loki'].includes(n));
    oldColumnNames.splice(0, oldColumnNames.length, ...filtredColumnNames);
  }
}
