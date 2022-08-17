
const { ccclass, property } = cc._decorator;
import { EventType, GameFlow, PlayerSprite } from "../Constant/Constant";
import { Event, EventEmitter } from "../Utils/EventEmitter";

const playerPosition = {
    InItPosition: -840,
    LeftOfScreen: -150,
    RightOfScreen: 150,
    EndPosition: 840
}

@ccclass
export default class Player extends cc.Component {

    @property(cc.Sprite)
    playerSprite: cc.Sprite = null;

    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.SpriteFrame)
    playerSprites: cc.SpriteFrame[] = [];

    playerTotalDistance: number = 0;
    screenVisibleWidth: number;
    private playerWidth: number = 600;
    private currentRoundData: any;
    exitSide: String;


    //TODO will send spawn side, what player has to say when he enters the screen,
    //TODO correct response from player and leaving side. This will be manager here
    //TODO if any data is not found then that behaviour is not be performed
    start() {
        this.screenSizeAndPlayerPosition();
    }
    protected onEnable(): void {
        this.registerEvent();
    }
    protected onDisable(): void {
        this.unRegisterEvent();
    }

    private registerEvent() {
        Event.on(EventType.PlayerPosition, this.playerMovement, this)
        Event.on(EventType.PlayerSprite, this.playerSpriteChange, this)
        Event.on(GameFlow.Player, this.getRoundData, this)
    }
    private unRegisterEvent() {
        Event.removeListener(EventType.PlayerPosition, this.playerMovement, this)
        Event.removeListener(EventType.PlayerSprite, this.playerSpriteChange, this)
        Event.removeListener(GameFlow.Player, this.getRoundData, this)
    }

    private getRoundData(currentRoundData: any) {
        this.currentRoundData = currentRoundData;
        console.log("Current Round Data : ", this.currentRoundData);
        this.setInitialPosition(currentRoundData.enteringSide);
        this.onNextRound();
    }

    private screenSizeAndPlayerPosition() {
        const screenSize = cc.view.getVisibleSize();
        this.screenVisibleWidth = screenSize.width;
        playerPosition.InItPosition = -((this.screenVisibleWidth / 2) + (this.playerWidth / 2));
        playerPosition.LeftOfScreen = -((this.screenVisibleWidth / 6) - 30);
        playerPosition.RightOfScreen = ((this.screenVisibleWidth / 12) + 30);
        playerPosition.EndPosition = ((this.screenVisibleWidth / 2) + ((this.playerWidth / 2)));
    }

    private setInitialPosition(enteringSide: any) {
        if (enteringSide === undefined) return;
        if (enteringSide === "left") {
            this.playerMovement(playerPosition.LeftOfScreen);
            this.unschedule(this.setInitialAction)
            this.scheduleOnce(this.setInitialAction, 2);
        }
        if (enteringSide === "right") {
            this.playerMovement(playerPosition.RightOfScreen);
            this.unschedule(this.setInitialAction);
            this.scheduleOnce(this.setInitialAction, 2);
        }
    }
    setExitPosition(exitSide: any) {
        if (exitSide === undefined) {
            return;
        }
        this.playerSpriteChange(PlayerSprite.GoodBye);
        this.exitSide = exitSide;
        this.unschedule(this.exitMovement)
        this.scheduleOnce(this.exitMovement, 1);
    }
    exitMovement() {
        if (this.exitSide === "left") {
            this.playerMovement(playerPosition.InItPosition);
        }
        if (this.exitSide === "right") {
            this.playerMovement(playerPosition.EndPosition);
        }
    }
    private setInitialAction() {
        Event.emit(EventType.PlayerSprite, this.currentRoundData.pose);
    }

    private onNextRound() {
        if (this.currentRoundData.pose === 4 || this.currentRoundData.enteringSide) {
            return;
        }
        this.playerSpriteChange(this.currentRoundData.pose);
    }
    playerSpriteChange(spriteFrame: number) {
        this.unschedule(this.playerIdleSprite);
        this.playerSprite.spriteFrame = this.playerSprites[spriteFrame];
        this.scheduleOnce(this.playerIdleSprite, 1)
    }
    playerIdleSprite() {
        this.playerSprite.spriteFrame = this.playerSprites[PlayerSprite.Idle];
    }
    playerMovement(playerPosition: number) {
        cc.tween(this.node)
            .to(1, { position: cc.v3(playerPosition, 300, 0) })
            .call(() => {
                if (this.currentRoundData === undefined) return;
                if (this.currentRoundData.exitSide)
                    Event.emit(EventType.NewRoundOnExit);
            })
            .start()
    }
}
