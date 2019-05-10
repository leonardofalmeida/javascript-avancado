"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacaoService = function () {
  function NegociacaoService() {
    _classCallCheck(this, NegociacaoService);

    this._http = new HttpService();
  }

  _createClass(NegociacaoService, [{
    key: "obterNegociacoes",
    value: function obterNegociacoes() {
      return Promise.all([this.obterNegociacoesSemana(), this.obterNegociacoesSemanaAnterior(), this.obterNegociacoesSemanaRetrasada()]).then(function (periodos) {
        var negociacoes = periodos.reduce(function (dados, periodo) {
          return dados.concat(periodo);
        }, []).map(function (dado) {
          return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
        });

        return negociacoes;
      }).catch(function (erro) {
        throw new Error(erro);
      });
    }
  }, {
    key: "obterNegociacoesSemana",
    value: function obterNegociacoesSemana() {
      return this._http.get("negociacoes/semana").then(function (negociacoes) {
        return negociacoes.map(function (objeto) {
          return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
        });
      }).catch(function (error) {
        console.log(error);
        throw new Error("Não foi possível obter as negociacoes da semana");
      });
    }
  }, {
    key: "obterNegociacoesSemanaAnterior",
    value: function obterNegociacoesSemanaAnterior() {
      return this._http.get("negociacoes/anterior").then(function (negociacoes) {
        return negociacoes.map(function (objeto) {
          return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
        });
      }).catch(function (error) {
        console.log(error);
        throw new Error("Não foi possível obter as negociacoes da semana anterior");
      });
    }
  }, {
    key: "obterNegociacoesSemanaRetrasada",
    value: function obterNegociacoesSemanaRetrasada() {
      return this._http.get("negociacoes/retrasada").then(function (negociacoes) {
        return negociacoes.map(function (objeto) {
          return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
        });
      }).catch(function (error) {
        console.log(error);
        throw new Error("Não foi possível obter as negociacoes da semana retrasada");
      });
    }
  }, {
    key: "cadastra",
    value: function cadastra(negociacao) {
      return ConnectionFactory.getConnection().then(function (connection) {
        return new NegociacaoDao(connection);
      }).then(function (dao) {
        return dao.adiciona(negociacao);
      }).then(function () {
        return "Negociação adicionada com sucesso";
      }).catch(function () {
        console.log(error);
        throw new Error("Não foi possível adicionar negociação");
      });
    }
  }, {
    key: "lista",
    value: function lista() {
      return ConnectionFactory.getConnection().then(function (connection) {
        return new NegociacaoDao(connection);
      }).then(function (dao) {
        return dao.listaTodos();
      }).catch(function (error) {
        console.log(error);
        throw new Error("Não foi possível adicionar negociação");
      });
    }
  }, {
    key: "apaga",
    value: function apaga() {
      return ConnectionFactory.getConnection().then(function (connection) {
        return new NegociacaoDao(connection);
      }).then(function (dao) {
        return dao.apagaTodos();
      }).then(function () {
        return "Negociações apagadas com sucesso";
      }).catch(function (error) {
        console.log(error);
        throw new Error("Não foi possível apagar negociações");
      });
    }
  }, {
    key: "importa",
    value: function importa(listaAtual) {
      return this.obterNegociacoes().then(function (negociacoes) {
        return negociacoes.filter(function (negociacao) {
          return !listaAtual.some(function (negociacaoExistente) {
            return JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente);
          });
        });
      }).catch(function (error) {
        console.log(error);
        throw new Error("Não foi possível importar negociações");
      });
    }
  }]);

  return NegociacaoService;
}();
//# sourceMappingURL=NegociacaoService.js.map