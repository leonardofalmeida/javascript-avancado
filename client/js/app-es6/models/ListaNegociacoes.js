export class ListaNegociacoes {
  constructor() {
    this._negociacoes = [];
  }

  ordena(criterio) {
    this._negociacoes.sort(criterio);
  }

  inverteOrdenacao() {
    this._negociacoes.reverse();
  }

  adiciona(negociacao) {
    this._negociacoes.push(negociacao);
  }

  get negociacoes() {
    return [].concat(this._negociacoes);
  }

  esvazia() {
    this._negociacoes = [];
  }

  getVolumeTotal() {
    return this._negociacoes.reduce(
      (total, negociacao) => total + negociacao.volume,
      0.0
    );
  }
}
