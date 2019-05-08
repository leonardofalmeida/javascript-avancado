class NegociacaoController {
  constructor() {
    // querys
    let $ = document.querySelector.bind(document);
    this._inputData = $("#data");
    this._inputQuantidade = $("#quantidade");
    this._inputValor = $("#valor");

    // ordenação
    this._ordenacaoAtual = "";

    //negociacoes
    this._listaNegociacoes = new Bind(
      new ListaNegociacoes(),
      new NegociacoesView($("#negociacoesView")),
      "adiciona",
      "esvazia",
      "ordena",
      "inverteOrdenacao"
    );

    // mensagens
    this._mensagem = new Bind(
      new Mensagem(),
      new MensagemView($("#mensagemView")),
      "texto"
    );

    ConnectionFactory.getConnection()
      .then(connection => new NegociacaoDao(connection))
      .then(dao => dao.listaTodos())
      .then(negociacoes =>
        negociacoes.forEach(negociacao =>
          this._listaNegociacoes.adiciona(negociacao)
        )
      )
      .catch(error => {
        console.log(error);
        this._mensagem.texto = error;
      });
  }

  ordena(coluna) {
    if (this._ordenacaoAtual == coluna) {
      this._listaNegociacoes.inverteOrdenacao();
    } else {
      this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
    }
    this._ordenacaoAtual = coluna;
  }

  adiciona(event) {
    event.preventDefault();

    ConnectionFactory.getConnection()
      .then(connection => {
        let negociacao = this._criaNegociacao();

        new NegociacaoDao(connection).adiciona(negociacao).then(() => {
          this._listaNegociacoes.adiciona(negociacao);
          this._mensagem.texto = "Negociação adicionada com sucesso";
          this._limpaFormulario();
        });
      })
      .catch(error => (this._mensagem.texto = error));
  }

  importaNegociacoes() {
    let service = new NegociacaoService();

    Promise.all([
      service.obterNegociacoesSemana(),
      service.obterNegociacoesSemanaAnterior(),
      service.obterNegociacoesSemanaRetrasada()
    ])
      .then(negociacoes =>
        negociacoes
          .reduce((flatArray, array) => flatArray.concat(array), [])
          .forEach(negociacao => {
            this._listaNegociacoes.adiciona(negociacao);
            this._mensagem.texto = "Negociacões obtidas com sucesso";
          })
      )
      .catch(error => (this._mensagem.texto = error));

    // Promises, mas retornando fora de sincronia
    //
    // service
    //   .obterNegociacoesSemana()
    //   .then(negociacoes =>
    //     negociacoes.forEach(negociacao => {
    //       this._listaNegociacoes.adiciona(negociacao);
    //       this._mensagem.texto = "Negociacões da semana obtidas com sucesso";
    //     })
    //   )
    //   .catch(error => (this._mensagem.texto = error));

    // service
    //   .obterNegociacoesSemanaAnterior()
    //   .then(negociacoes =>
    //     negociacoes.forEach(negociacao => {
    //       this._listaNegociacoes.adiciona(negociacao);
    //       this._mensagem.texto =
    //         "Negociacões da semana anterior obtidas com sucesso";
    //     })
    //   )
    //   .catch(error => (this._mensagem.texto = error));

    // service
    //   .obterNegociacoesSemanaRetrasada()
    //   .then(negociacoes =>
    //     negociacoes.forEach(negociacao => {
    //       this._listaNegociacoes.adiciona(negociacao);
    //       this._mensagem.texto =
    //         "Negociacões da semana retrasada obtidas com sucesso";
    //     })
    //   )
    //   .catch(error => (this._mensagem.texto = error));

    // Antes com callback hell
    //
    // service.obterNegociacoesSemana((err, negociacoes) => {
    //   if (err) {
    //     this._mensagem.texto = err;
    //     return;
    //   }

    //   negociacoes.forEach(negociacao =>
    //     this._listaNegociacoes.adiciona(negociacao)
    //   );

    //   service.obterNegociacoesSemanaAnterior((err, negociacoes) => {
    //     if (err) {
    //       this._mensagem.texto = err;
    //       return;
    //     }

    //     negociacoes.forEach(negociacao =>
    //       this._listaNegociacoes.adiciona(negociacao)
    //     );

    //     service.obterNegociacoesSemanaRetrasada((err, negociacoes) => {
    //       if (err) {
    //         this._mensagem.texto = err;
    //         return;
    //       }

    //       negociacoes.forEach(negociacao =>
    //         this._listaNegociacoes.adiciona(negociacao)
    //       );
    //     });
    //   });
    // });
  }

  apaga() {
    ConnectionFactory.getConnection()
      .then(connection => new NegociacaoDao(connection))
      .then(dao => dao.apagaTodos())
      .then(mensagem => {
        this._mensagem.texto = mensagem;
        this._listaNegociacoes.esvazia();
      })
      .catch(error => console.log(error));
  }

  _criaNegociacao() {
    return new Negociacao(
      DateHelper.textoParaData(this._inputData.value),
      parseInt(this._inputQuantidade.value),
      parseFloat(this._inputValor.value)
    );
  }

  _limpaFormulario() {
    this._inputData.value = "";
    this._inputQuantidade.value = 1;
    this._inputValor.value = 0.0;
    this._inputData.focus();
  }
}
