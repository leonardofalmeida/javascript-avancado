class NegociacaoService {
  constructor() {
    this._http = new HttpService();
  }

  obterNegociacoes() {
    let service = new NegociacaoService();
    service
      .obterNegociacoes()
      .then(negociacoes => {
        negociacoes.forEach(negociacao =>
          this._listaNegociacoes.adiciona(negociacao)
        );
        this._mensagem.texto = "Negociações do período importadas com sucesso";
      })
      .catch(error => (this._mensagem.texto = error));
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
