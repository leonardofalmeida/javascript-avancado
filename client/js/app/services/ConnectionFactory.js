"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var _createClass, stores, version, dbName, connection, close, ConnectionFactory;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      stores = ["negociacoes"];
      version = 4;
      dbName = "cursojs";
      connection = null;
      close = null;

      _export("ConnectionFactory", ConnectionFactory = function () {
        function ConnectionFactory() {
          _classCallCheck(this, ConnectionFactory);

          throw new Error("Não é possível criar instâncias de ConnectionFactory");
        }

        _createClass(ConnectionFactory, null, [{
          key: "getConnection",
          value: function getConnection() {
            return new Promise(function (resolve, reject) {
              var openRequest = window.indexedDB.open(dbName, version);

              openRequest.onupgradeneeded = function (e) {
                ConnectionFactory._createStore(e.target.result);
              };

              openRequest.onsuccess = function (e) {
                if (!connection) {
                  connection = e.target.result;

                  /* associa this ao connection, e não ao close */
                  close = connection.close.bind(connection);

                  connection.close = function () {
                    throw new Error("Você não pode fechar essa conexão diretamente.");
                  };
                }

                resolve(connection);
              };

              openRequest.onerror = function (e) {
                console.log(e.target.error);
                reject(e.target.error.name);
              };
            });
          }
        }, {
          key: "_createStore",
          value: function _createStore(connection) {
            stores.forEach(function (store) {
              if (connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store);
            });
            connection.createObjectStore(stores, { autoIncrement: true });
          }
        }, {
          key: "_closeConnection",
          value: function _closeConnection() {
            if (connection) {
              close();
              connection = null;
            }
          }
        }]);

        return ConnectionFactory;
      }());

      _export("ConnectionFactory", ConnectionFactory);
    }
  };
});
//# sourceMappingURL=ConnectionFactory.js.map