const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimBase extends cc.Component {
  @property(cc.Animation)
  anim: cc.Animation = null;

  @property
  clipName: string = "popUp";

  //callback = ({default : null , visible : false})
  callback: any = null;
  //reverse = ({default : false , visible : false})
  reverse: boolean = false;

  play(msg: string, cb: any) {


    this.callback = cb;
    if (msg == "showPopUp") {
      this.anim.play(this.clipName).wrapMode = cc.WrapMode.Normal;
      this.reverse = false;
    } else {
      this.anim.play(this.clipName).wrapMode = cc.WrapMode.Reverse;
      this.reverse = true;
    }
  }
  onAnimEnd() {
    if (!this.reverse) {

      this.callback();
    }
  }

  OnAnimStart() {
    if (this.reverse) {

      this.callback();
    }
  }
}
