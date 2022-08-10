
const { ccclass, property } = cc._decorator;
import { EventType, PlayerSprite } from "../Constant/Constant";
import { Event, EventEmitter } from "../Utils/EventEmitter";

@ccclass
export default class Player extends cc.Component {

    @property(cc.Sprite)
    playerSprite: cc.Sprite = null;

    @property(cc.Node)
    playerNode: cc.Node = null;

    @property(cc.SpriteFrame)
    playerSprites: cc.SpriteFrame[] = [];

    playerTotalDistance: number = 0;

    //TODO will send spawn side, what player has to say when he enters the screen,
    //TODO correct response from player and leaving side. This will be manager here
    //TODO if any data is not found then that behaviour is not be performed

    protected onEnable(): void {
        this.registerEvent();
    }
    protected onDisable(): void {
        this.unRegisterEvent();
    }

    private registerEvent() {
        Event.on(EventType.PlayerPosition, this.playerMovement, this)
        Event.on(EventType.PlayerSprite, this.playerSpriteChange, this)
    }
    private unRegisterEvent() {
        Event.removeListener(EventType.PlayerPosition, this.playerMovement, this)
        Event.removeListener(EventType.PlayerSprite, this.playerSpriteChange, this)
    }

    playerSpriteChange(spriteFrame: number) {
        console.log("Sprite", spriteFrame)
        this.unschedule(this.playerIdleSprite);
        this.playerSprite.spriteFrame = this.playerSprites[spriteFrame];
        this.scheduleOnce(this.playerIdleSprite, 1)
    }
    playerIdleSprite() {
        this.playerSprite.spriteFrame = this.playerSprites[PlayerSprite.Idle];
    }

    playerMovement(playerPosition: number, isDead: boolean) {
        var playerTravelDistance = playerPosition - this.playerTotalDistance;
        const tweenTime = (playerTravelDistance / 270);
        this.playerTotalDistance = playerPosition;
        cc.tween(this.playerNode)
            .to(1, { position: cc.v3(playerPosition, 0, 0) })
            .start()
        if (isDead === true) { this.playerNode.destroy(); }

    }
}
