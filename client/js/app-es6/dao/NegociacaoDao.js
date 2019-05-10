import { Negociacao } from "../models/Negociacao";

export class NegociacaoDao {
  constructor(connection) {
    this._connection = connection;
    this._store = "negociacoes";
  }

  adiciona(negociacao) {
    return new Promise((resolve, reject) => {
      let request = this._connection
        .transaction([this._store], "readwrite")
        .objectStore(this._store) // obtém o object store
        .add(negociacao); // manda a requisição

      request.onsuccess = e => {
        resolve();
      };

      request.onerror = e => {
        console.log(e.target.error);
        reject("Nao foi possível adicionar.");
      };
    });
  }

  listaTodos() {
    return new Promise((resolve, reject) => {
      let response = this._connection
        .transaction([this._store], "readwrite")
        .objectStore(this._store)
        .openCursor(); //cria o ponteiro para as negociações

      let negociacoes = [];

      response.onsuccess = e => {
        let atual = e.target.result; // é um PONTEIRO

        // Se existe negociações para serem lidas
        if (atual) {
          let dado = atual.value; // é um json
          negociacoes.push(
            new Negociacao(dado._data, dado._quantidade, dado._valor)
          );

          atual.continue(); // ponteiro aponta para próxima negociação
        } else {
          resolve(negociacoes);
        }
      };

      response.onerror = e => {
        console.log(e.target.error.name);
        reject("Não foi possível listar as negociações");
      };
    });
  }

  apagaTodos() {
    return new Promise((resolve, reject) => {
      let request = this._connection
        .transaction([this._store], "readwrite")
        .objectStore(this._store)
        .clear(); //cria o ponteiro para as negociações

      request.onsuccess = e => {
        resolve("Negociações removidas com sucesso.");
      };

      request.onerror = e => {
        console.log(e.target.error);
        reject("Nao foi possível apagar as negociações.");
      };
    });
  }
}
