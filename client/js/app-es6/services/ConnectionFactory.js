/* Module Pattern, IIFE */
var ConnectionFactory = (function() {
  const stores = ["negociacoes"];
  const version = 4;
  const dbName = "cursojs";

  var connection = null;

  var close = null;

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
          if (!connection) {
            connection = e.target.result;

            /* associa this ao connection, e não ao close */
            close = connection.close.bind(connection);

            connection.close = function() {
              throw new Error("Você não pode fechar essa conexão diretamente.");
            };
          }

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

    static _closeConnection() {
      if (connection) {
        close();
        connection = null;
      }
    }
  };
})();
