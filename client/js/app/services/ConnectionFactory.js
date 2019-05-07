/* Module Pattern, IIFE */
var ConnectionFactory = (function() {
  var stores = ["negociacoes"];
  var version = 4;
  var dbName = "cursojs";

  var connection = null;

  return class ConnectionFactory {
    constructor() {
      throw new Error("Não é possível criar instâncias de ConnectionFactory");
    }

    static getConnection() {
      return new Promise((resolve, reject) => {
        let openRequest = window.indexedDB.open(dbName, version);

        openRequest.onupgradeneeded = e => {
          ConnectionFactory._createStore(e.target.result);
        };

        openRequest.onsuccess = e => {
          if (!connection) connection = e.target.result;
          resolve(connection);
        };

        openRequest.onerror = e => {
          console.log(e.target.error);
          reject(e.target.error.name);
        };
      });
    }

    static _createStore(connection) {
      stores.forEach(store => {
        if (connection.objectStoreNames.contains(store))
          connection.deleteObjectStore(store);
      });
      connection.createObjectStore(stores, { autoIncrement: true });
    }
  };
})();
