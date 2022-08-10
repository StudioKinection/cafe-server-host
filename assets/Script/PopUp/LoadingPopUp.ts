

import PopUpBase from "../Utils/PopUps/PopUpBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingPopUp extends PopUpBase {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
