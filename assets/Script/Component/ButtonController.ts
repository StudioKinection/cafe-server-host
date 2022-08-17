const { ccclass, property } = cc._decorator;
@ccclass
export default class ButtonController extends cc.Component {

    @property()
    private targetString: string = "";

    public getButtonText() {
        return this.targetString
    }
    onClick(event, customEventData) {

        console.log("Hello : " + customEventData);
        this.getButtonText();
    }
    public setButtonState(state: boolean) {
        this.node.active = state;
    }

}
