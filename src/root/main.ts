import { Composer } from "./composer";
const composer = new Composer();
const presenter = composer.composePresenter();

window.onload = () => {
  presenter.initialize();
};
