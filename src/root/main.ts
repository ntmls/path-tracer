import { Composer } from "./Composer"
const composer = new Composer();
const presenter = composer.composePresenter();

window.onload = () => {
    presenter.initialize()
}