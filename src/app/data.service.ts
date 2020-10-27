import { Injectable } from '@angular/core';
import { Papa, ParseResult } from 'ngx-papaparse';
import loki, { Collection } from 'lokijs';
import _ from 'lodash';

let db: loki = new loki('db.json');

export class LoadResult {
  success: boolean;
  headers?: string[];
  proposedIndices?: string[];
  save?: SaveCallback;
}

type SaveCallback = (indicies: string[], complete: (collectionName: string) => void) => void;
type LoadCompleteCallback = (result: LoadResult) => void
type DataCollectionEntry = {
  onUpdateCallback: (() => void)[],
  views: {
    viewName: string,
    columnNames: string[],
  }[],
  handles: number
};
type LocalStorageEntry = {
  collections: {[id: string]: any[]},
  indices: {[id: string]: string[]},
  dataCollectionEntry: DataCollectionEntry
}
type LocaStorageMetadataEntry = {
  metaEntries: {[id: string]: {
    date: Date
  }}
}

const autoId = 'ID';

function hasDuplicates(array: any[]) {
  return (new Set(array)).size !== array.length;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataCollectionEntries: {
    [id: string]: DataCollectionEntry
  } = {};

  constructor(private papa: Papa) { }

  public loadDataFromFile(file: File, importSettings: any,
    completeCallback: LoadCompleteCallback) {
    const fileName = file.name.split('.')[0];
    this.parse(file, fileName, importSettings, completeCallback);
  }

  public loadDataFromAssets(url: string, name: string, importSettings: any,
    completeCallback: LoadCompleteCallback) {
    this.parse(url, name, importSettings, completeCallback);
  }

  public getViewaAsCsv(viewName: string) {
    const entries = this.getViewEntries(viewName, -1);
    const columns = this.getViewColumns(viewName);
    const csv = this.papa.unparse(entries, {
      columns: columns
    });

    return csv;
  }

  public getAutoIdName() {
    return autoId;
  }

  public getSavedCollectionNames() {
    return Object.keys(localStorage).filter(k => k.startsWith('collection_')).map(k => k.replace('collection_', ''));
  }

  public loadSavedCollection(collectionName: string) {
    const collectionEntry: LocalStorageEntry = JSON.parse(localStorage[`collection_${collectionName}`]);
    this.dataCollectionEntries[collectionName] = collectionEntry.dataCollectionEntry;

    for(const view of collectionEntry.dataCollectionEntry.views) {
      let collection: Collection = db.addCollection(collectionName, {
        indices: collectionEntry.indices[view.viewName]
      });
      collection.insert(collectionEntry.collections[view.viewName].map(row => {
        return _.omit(row, ['$loki', 'meta']);
      }));
    }
  }

  public getSavedCollectionDate(collectionName: string) {
    let metadata: LocaStorageMetadataEntry = JSON.parse(localStorage.getItem('$metadata'));
    return new Date(metadata.metaEntries[collectionName].date);
  }

  private saveInLocalStorage(collectionName: string, collectionEntry: DataCollectionEntry) {
    console.log(`Saving collection: ${collectionName}`)
    let localStorageEntry: LocalStorageEntry = {
      dataCollectionEntry: collectionEntry,
      collections: {},
      indices: {}
    };

    for(const view of collectionEntry.views) {
      localStorageEntry.collections[view.viewName] = this.getView(view.viewName).data;
      localStorageEntry.indices[view.viewName] = this.getViewIndices(view.viewName);
    }

    localStorage.setItem(`collection_${collectionName}`, JSON.stringify(localStorageEntry));

    let metadata: LocaStorageMetadataEntry = JSON.parse(localStorage.getItem('$metadata'));
    if(!metadata) {
      metadata = {
        metaEntries: {}
      };
    }
    metadata.metaEntries[collectionName] = {date: new Date()};
    localStorage.setItem('$metadata', JSON.stringify(metadata));
  }

  private parse(asset: File | string, datasetName: string, importSettings: any,
    completeCallback: LoadCompleteCallback) {
    this.papa.parse(asset, {
      complete: parseResult => {
        this.addCollectionEntry(datasetName, parseResult,
          importSettings.generateIndex, completeCallback);
      },
      transformHeader: (header) => header === '' ? 'ID' : header,
      header: importSettings.hasHeader,
      skipEmptyLines: true,
      dynamicTyping: true,
      comments: "#",
      download: true,
    });
  }

  private addCollectionEntry(filename: string, parseResult: ParseResult,
    generateIndex: boolean, completeCallback: LoadCompleteCallback) {

    let data = parseResult.data;
    const collectionName = this.generateCollectionName(filename);
    this.handleCommaNumbers(data);
    const header = this.getHeader(parseResult);

    if(hasDuplicates(header)) {
      completeCallback({
        success: false,
      });
      return;
    }

    // const columnTypes = this.getColumnTypes(header, data);
    this.repairTypeConsistency();
    data = this.remapCollection(data);

    let proposedIndices = [];
    proposedIndices.push(autoId);
    if (!header.includes(autoId) && generateIndex) {
      this.generateIndex(data, header);
    }

    completeCallback({
      success: true,
      headers: header,
      proposedIndices: proposedIndices,
      save: (indicies, complete) => {
        const collectionEntry = this.addCollection(collectionName, indicies, header, data);
        parseResult = null;
        complete(collectionName);
        this.saveInLocalStorage(collectionName, collectionEntry);
      }
    });
  }

  private getHeader(parseResult: ParseResult) {
    let header: string[];
    if (parseResult.meta.fields === undefined) {
      header = Array.from(
        { length: parseResult.data[0].length - 1 },
        (x, i) => i.toString()
      );
    } else {
      header = parseResult.meta.fields;
    }

    return header;
  }


  private handleCommaNumbers(data: any[]) {
    const dataLength = data.length;

    for (const fieldName in data[0]) {
      const parsed = this.parseCommaNumberColumn(data, fieldName);

      if (parsed.isParsed && parsed.successfullyParsedCount > dataLength / 2) {
        for (let i = 0; i < dataLength; ++i) {
          data[i][fieldName] = parsed.parsedNumbers[i];
        }
      }
    }
  }

  private generateIndex(data: any[], header: string[]) {
    header.unshift(autoId);

    let i = 0;
    for (let row of data) {
      row[autoId] = i;
      i += 1;
    }
  }

  private parseCommaNumberColumn(data: any[], fieldName: string) {
    const dataLength = data.length;
    const splitPoint = Math.floor(Math.sqrt(dataLength));
    const parsedNumbers = new Array(dataLength);
    let successfullyParsedCount = 0;

    const parse = (begin: number, end: number) => {
      for (let i = begin; i < end; ++i) {
        const val = this.parseCommaNumber(data[i][fieldName]);
        parsedNumbers[i] = val;
        if (!isNaN(val)) {
          successfullyParsedCount += 1;
        }
      }
    };

    parse(0, splitPoint);
    let isParsed = false;
    if (successfullyParsedCount > splitPoint / 2) {
      parse(splitPoint, dataLength);
      isParsed = true;
    }

    return { isParsed, parsedNumbers, successfullyParsedCount };
  }

  private parseCommaNumber(strNumber: string): number {
    if (typeof strNumber === 'string') {
      return parseFloat(strNumber.replace(',', '.'));
    } else {
      return NaN;
    }
  }

  private repairTypeConsistency() {
  }


  // public loadDataFromAssets(assetName: string,
  //   indicesSelector: (headers: string[],
  //     save: (indicies: string[], complete: (collectionName: string) => void) => void) => void) {

  //   let fileName = assetName.split('.')[0];
  //   let parseResult: ParseResult;

  //   const collectionName = this.generateCollectionName(fileName);

  //   let save = (indicies: string[],
  //     complete: (collectionName: string) => void) => {

  //     this.addCollection(collectionName, indicies, parseResult.meta.fields, parseResult.data);
  //     parseResult = null;
  //     complete(collectionName);
  //   };

  //   fetch(`assets/${assetName}`).then(r => r.text()).then(data => {
  //     this.papa.parse(data, {
  //       complete: (result) => {
  //         parseResult = result;
  //         indicesSelector(result.meta.fields, save);
  //       },
  //       transformHeader: (header) => header === '' ? 'ID' : header,
  //       header: true,
  //       skipEmptyLines: true,
  //       dynamicTyping: true
  //     });
  //   });
  // }

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
    return Object.keys(this.dataCollectionEntries);
  }

  public getViewNames(): string[] {
    let viewNames: string[] = [];
    for (let [_, value] of Object.entries(this.dataCollectionEntries)) {
      viewNames.push(...value.views.map(v => v.viewName));
    }

    return viewNames;
  }

  public getCollectionViewNames(collectionName: string) {
    return this.dataCollectionEntries[collectionName].views.map(v => v.viewName);
  }

  public getViewNameCollection(viewName: string) {
    for (let [collectionName, collectionValue] of Object.entries(this.dataCollectionEntries)) {
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
    for (let collection of Object.values(this.dataCollectionEntries)) {
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

  public onCollectionUpdate(collectionName: string, callback: () => void) {
    this.dataCollectionEntries[collectionName].onUpdateCallback.push(callback);
  }

  public addCollection(collectionName: string, indices: string[], columnNames: string[], data: any[]) {
    let collection: Collection = db.addCollection(collectionName, {
      indices: indices
    });
    data = this.remapCollection(data);
    collection.insert(data);

    return this.dataCollectionEntries[collectionName] = {
      onUpdateCallback: [],
      views: [{
        viewName: collectionName,
        columnNames: columnNames
      }],
      handles: 1
    };
  }

  private remapCollection(data: any[]) {
    if (Array.isArray(data[0])) {
      data = data.map(row => {
        let obj = {};
        for (let i = 0; i < row.length; ++i) {
          obj[i.toString()] = row[i];
        }
        return obj;
      });
    }

    return data;
  }

  public addCollectionView(collectionName: string, viewName: string,
    columnNames: string[], indicies: string[], data: any[]) {

    const newCollection = db.addCollection(viewName, {
      indices: indicies
    });
    newCollection.insert(data);

    this.dataCollectionEntries[collectionName].views.push({
      viewName: viewName,
      columnNames: columnNames
    });
  }

  public removeView(viewName: string) {
    Object.entries(this.dataCollectionEntries).forEach(([cName, c]) => {
      const foundIndex = c.views.findIndex(v => v.viewName == viewName);
      if (foundIndex != -1) {
        db.removeCollection(c.views[foundIndex].viewName);
        c.views.splice(foundIndex, 1);
        this.collectionUpdated(cName);
      }
    });
  }

  public addCollectionHandle(collectionName: string) {
    this.dataCollectionEntries[collectionName].handles += 1;
  }

  public removeCollectionHandle(collectionName: string) {
    this.dataCollectionEntries[collectionName].handles -= 1;

    if (this.dataCollectionEntries[collectionName].handles <= 0) {
      this.dataCollectionEntries[collectionName].views.forEach(v => db.removeCollection(v.viewName));
      db.removeCollection(collectionName);
      delete this.dataCollectionEntries[collectionName];
    }
  }

  public collectionUpdated(collectionName: string) {
    this.dataCollectionEntries[collectionName].onUpdateCallback.forEach(c => c());
  }

  public updateViewColumnNames(viewName: string) {
    const newColumnNames = Object.keys(this.getView(viewName).findOne());
    let oldColumnNames = this.getViewColumns(viewName);
    const filtredColumnNames = newColumnNames.filter(n => !['meta', '$loki'].includes(n));
    oldColumnNames.splice(0, oldColumnNames.length, ...filtredColumnNames);
  }
}
