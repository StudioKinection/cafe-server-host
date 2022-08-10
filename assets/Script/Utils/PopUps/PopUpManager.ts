import PopUpBase from "./PopUpBase";
enum PopUpType {
  None = 100,
  LoadingPopUp = 0,
  GamePausePopUp = 1,
  EndScreenPopUp = 2,
}

declare global {
  interface Window {
    PopUpManager: PopUpManager;
    PopUpType: typeof PopUpType;
  }
}
window.PopUpType = PopUpType;

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopUpManager extends cc.Component {
  @property(PopUpBase)
  public popUps: PopUpBase[] = [];

  public currentPopUp: PopUpType = PopUpType.None;
  public currentOverLayedPopUps: PopUpType[] = [];

  onLoad() {
    window.PopUpManager = this;
  }
  /**
   * Show Pop up
   */
  show(popUp: PopUpType, data: any = null, callback: any = null) {
    var isOpen = this.currentOverLayedPopUps.indexOf(popUp) === -1 ? false : true;
    if (popUp !== null && popUp !== PopUpType.None && !isOpen) {
      this.currentOverLayedPopUps.push(popUp);
      this.popUps[popUp].node.active = true;
      var anim = this.popUps[popUp].getComponent("AnimBase");
      var inst = this;
      if (anim !== null) {
        anim.play("showPopUp", function () {
          inst.popUps[popUp].onShow(data);
          if (callback !== null) callback();
        });
      } else {
        this.popUps[popUp].onShow(data);
        if (callback !== null) callback();
      }
      this.currentPopUp = popUp;
    }
  }

  /**
   * Hide PopUp
   */
  hide(popUp: PopUpType, callBack: any = null) {
    var isOpen = this.currentOverLayedPopUps.indexOf(popUp) == -1 ? false : true;
    if (popUp !== null && popUp !== PopUpType.None && isOpen) {
      this.currentOverLayedPopUps.splice(this.currentOverLayedPopUps.indexOf(popUp), 1);
      var anim = this.popUps[popUp].getComponent("AnimBase");
      var inst = this;
      if (anim !== null) {
        anim.play("hidePopUp", function () {
          inst.popUps[popUp].node.active = false;
          inst.popUps[popUp].onHide();
          if (callBack !== null) callBack();
        });
      } else {
        this.popUps[popUp].onHide();
        if (callBack !== null) callBack();
        this.popUps[popUp].node.active = false;
      }
      this.currentPopUp = this.currentOverLayedPopUps[this.currentOverLayedPopUps.length - 1];
    } else {
      if (callBack !== null) callBack();
    }
  }

  /**
   * Hide current PopUp
   */
  hideCurrentPopUp(callBack: any = null) {
    this.hide(this.currentPopUp, callBack);
  }

  /**
   * Hide all Popups
   */
  hideAllPopUps() {
    while (this.currentOverLayedPopUps.length !== 0) {
      this.hide(this.currentPopUp);
    }
  }
}
