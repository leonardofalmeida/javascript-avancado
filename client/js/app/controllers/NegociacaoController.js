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

    this._service = new NegociacaoService();

    this._init();
  }

  _init() {
    this._service
      .lista()
      .then(negociacoes =>
        negociacoes.forEach(negociacao =>
          this._listaNegociacoes.adiciona(negociacao)
        )
      )
      .catch(error => {
        this._mensagem.texto = error;
      });

    setInterval(() => {
      this.importaNegociacoes();
    }, 3000);
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

    let negociacao = this._criaNegociacao();

    this._service
      .cadastra(negociacao)
      .then(mensagem => {
        this._listaNegociacoes.adiciona(negociacao);
        this._mensagem.texto = mensagem;
        this._limpaFormulario();
      })
      .catch(erro => (this._mensagem.texto = erro));
  }

  importaNegociacoes() {
    this._service
      .importa(this._listaNegociacoes.negociacoes)
      .then(negociacoes => {
        negociacoes.forEach(negociacao => {
          this._listaNegociacoes.adiciona(negociacao);
          this._mensagem.texto =
            "Negociações do período importadas com sucesso";
        });
      })
      .catch(error => (this._mensagem.texto = error));
  }

  apaga() {
    this._service
      .apaga()
      .then()
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
