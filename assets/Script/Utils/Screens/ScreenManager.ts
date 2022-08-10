import AbstractScreen from './AbstractScreen';

enum ScreenEnum {
    NONE = 100,
    MainMenuScreen = 0,
    InstructionScreen = 1,
    GameScreen = 2,
    EndScreen = 3,


}

enum ScreenState {
    SHOWN = 0,
    HIDDEN = 1,
    NONE = 2
}

declare global {
    interface Window {
        ScreenManager: ScreenManager;
        ScreenEnum: typeof ScreenEnum;
    }
}
window.ScreenEnum = ScreenEnum;

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScreenManager extends cc.Component {
    @property(AbstractScreen)
    public screens: AbstractScreen[] = [];

    public currentScreen: ScreenEnum = null;
    public screenState: ScreenState = null;

    onLoad() {
        window.ScreenManager = this;
        this.currentScreen = ScreenEnum.MainMenuScreen;
    }

    showScreen(screen: number, optionalData: any = null, callBack: any = null) {
        this.enableNewScreen(screen, optionalData, callBack);
    }

    enableNewScreen(screen: number, optionalData: any = null, callBack: any = null) {
        if (this.currentScreen !== ScreenEnum.NONE) {
            this.hideCurrentScreen(screen, optionalData, callBack);
            return
        }
        this.showNextScreen(screen, optionalData, callBack);
    }

    showNextScreen(screen: number, optionalData: any = null, callBack: any = null) {
        this.screens[screen].node.active = true;
        this.currentScreen = screen;
        this.screens[screen].onShow(optionalData);
        if (callBack !== null) callBack();
        this.screenState = ScreenState.SHOWN;
    }

    hideCurrentScreen(nextScreen: number, nextOptionalData: any = null, nextCallBack: any = null) {
        this.screens[this.currentScreen].node.active = false;
        this.screenState = ScreenState.HIDDEN;
        this.currentScreen = ScreenEnum.NONE;
        if (nextScreen !== null) this.showNextScreen(nextScreen, nextOptionalData, nextCallBack);
    }
}

