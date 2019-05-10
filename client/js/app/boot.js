import { NegociacaoController } from "./controllers/NegociacaoController";

let negociacaoController = new NegociacaoController();

document.querySelector(".form").onsubmit = negociacaoController.adiciona.bind(
  negociacaoController
);

document.querySelector(
  "[type=button]"
).onclick = negociacaoController.apaga.bind(negociacaoController);
