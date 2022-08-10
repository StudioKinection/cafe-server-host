const { ccclass, property } = cc._decorator;
@ccclass
export default class ButtonController extends cc.Component {

    @property()
    private targetString: string = "";

    public getButtonText() {
        return this.targetString
    }

    public setButtonState(state: boolean) {
        this.node.active = state;
    }

}
