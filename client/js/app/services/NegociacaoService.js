class NegociacaoService {
  constructor() {
    this._http = new HttpService();
  }

  obterNegociacoes() {
    return Promise.all([
      this.obterNegociacoesSemana(),
      this.obterNegociacoesSemanaAnterior(),
      this.obterNegociacoesSemanaRetrasada()
    ])
      .then(periodos => {
        let negociacoes = periodos
          .reduce((dados, periodo) => dados.concat(periodo), [])
          .map(
            dado =>
              new Negociacao(new Date(dado.data), dado.quantidade, dado.valor)
          );

        return negociacoes;
      })
      .catch(erro => {
        throw new Error(erro);
      });
  }

  obterNegociacoesSemana() {
    return this._http
      .get("negociacoes/semana")
      .then(negociacoes => {
        return negociacoes.map(
          objeto =>
            new Negociacao(
              new Date(objeto.data),
              objeto.quantidade,
              objeto.valor
            )
        );
      })
      .catch(error => {
        console.log(error);
        throw new Error("Não foi possível obter as negociacoes da semana");
      });
  }

  obterNegociacoesSemanaAnterior() {
    return this._http
      .get("negociacoes/anterior")
      .then(negociacoes => {
        return negociacoes.map(
          objeto =>
            new Negociacao(
              new Date(objeto.data),
              objeto.quantidade,
              objeto.valor
            )
        );
      })
      .catch(error => {
        console.log(error);
        throw new Error(
          "Não foi possível obter as negociacoes da semana anterior"
        );
      });
  }

  obterNegociacoesSemanaRetrasada() {
    return this._http
      .get("negociacoes/retrasada")
      .then(negociacoes => {
        return negociacoes.map(
          objeto =>
            new Negociacao(
              new Date(objeto.data),
              objeto.quantidade,
              objeto.valor
            )
        );
      })
      .catch(error => {
        console.log(error);
        throw new Error(
          "Não foi possível obter as negociacoes da semana retrasada"
        );
      });
  }
}
