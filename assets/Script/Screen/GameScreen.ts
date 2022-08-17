
import Player from "../Component/Player";
import { CharacterType, EventType, GameFlow, PlayerSprite } from "../Constant/Constant";
import { GameData, IRoundData } from "../Constant/GameData";
import { Event } from "../Utils/EventEmitter";
import AbstractScreen from "../Utils/Screens/AbstractScreen";

const playerPosition = {
    InItPosition: -740,
    LeftOfScreen: -270,
    RightOfScreen: 270,
    EndPosition: 740
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameScreen extends AbstractScreen {

    @property(cc.Prefab)
    playerPrefabs: cc.Prefab[] = []; //this has to be an array so that we can spawn any of the 6 character
    @property(cc.Node)
    private playerHolderNode: cc.Node = null;
    @property(cc.Node)
    private bubbleButtonsNode: cc.Node[] = [];
    @property(cc.Node)
    private bubbleNodePlaceHolder: cc.Node = null;
    @property(cc.Button)
    private bottomButtons: cc.Button[] = [];

    private isMouseDown: boolean = false;
    private playerWidth: number = 600;
    private playerHeight: number = 600;
    private initialBubblePosition = new cc.Vec2(0, 0);
    private currenttargetBubbleNode: cc.Node = null;
    private lastTargetBubbleNode: cc.Node = null;
    private initialBubblePositionLastnode = new cc.Vec2(0, 0);
    private screenVisibleWidth: number;

    private currentRoundIndex: number = 0;
    private allPlayersInGameRef: Map<string, Player> = null
    private currentRoundData: IRoundData;
    private lastRoundData: IRoundData;


    protected onLoad(): void {
        this.screenSizeAndPlayerPosition();
    }

    onShow() {
        //this.makeATestingPlayer();
        this.reset();
        this.registerEvent();
        this.startNextRound();
        this.bottomButtonInteractibility();
    }

    onHide() {
        this.unRegisterEvent();
    }

    private reset() {
        //if (typeof this.allPlayersInGameRef === typeof {}) {this.allPlayersInGameRef.clear(); }
        if (this.allPlayersInGameRef !== null) this.allPlayersInGameRef.clear();
        else this.allPlayersInGameRef = new Map<string, Player>()
        this.currentRoundIndex = 0;
        this.playerHolderNode.removeAllChildren();
    }

    private registerEvent() {
        for (const buttonNode of this.bubbleButtonsNode) {
            buttonNode.on(cc.Node.EventType.TOUCH_START, this.bubbleNodeStartEvent, this)
            buttonNode.on(cc.Node.EventType.TOUCH_MOVE, this.bubbleNodeMoveEvent, this)
            buttonNode.on(cc.Node.EventType.TOUCH_END, this.bubbleNodeEndEvent, this)
            buttonNode.on(cc.Node.EventType.TOUCH_CANCEL, this.bubbleNodeEndEvent, this)

        }
        Event.on(EventType.NewRoundOnExit, this.onNewRound, this);
    }
    private unRegisterEvent() {
        for (const buttonNode of this.bubbleButtonsNode) {
            buttonNode.off(cc.Node.EventType.TOUCH_START, this.bubbleNodeStartEvent, this)
            buttonNode.off(cc.Node.EventType.TOUCH_MOVE, this.bubbleNodeMoveEvent, this)
            buttonNode.off(cc.Node.EventType.TOUCH_END, this.bubbleNodeEndEvent, this)
            buttonNode.off(cc.Node.EventType.TOUCH_CANCEL, this.bubbleNodeEndEvent, this)

        }
        Event.removeListener(EventType.NewRoundOnExit, this.onNewRound, this);
    }

    private startNextRound() {
        this.currentRoundData = this.getCurrentRoundData();
        this.sendRoundData();
        if (this.currentRoundData === undefined) {
            this.gameOver();
            return;
        }
        //TODO make a new player depending on data or Use the exsisting one in scene
        const playerCharacter = this.allPlayersInGameRef.get(this.currentRoundData.chracter);
        if (playerCharacter !== undefined) {
            return;
        }
        const playerNode: cc.Node = cc.instantiate(this.playerPrefabs[CharacterType[this.currentRoundData.chracter]]);
        this.playerHolderNode.addChild(playerNode);
        playerNode.y = this.playerHeight / 2;
        if (this.currentRoundData.enteringSide === "left") {
            playerNode.x = -((this.screenVisibleWidth / 2) + (this.playerWidth / 2));
        }
        if (this.currentRoundData.enteringSide === "right") {
            playerNode.x = ((this.screenVisibleWidth / 2) + (this.playerWidth / 2));
        }
        const playerComp = playerNode.getComponent(Player)
        this.allPlayersInGameRef.set(this.currentRoundData.chracter, playerComp)
        this.setGameUI(this.currentRoundData)
        this.sendRoundData();
        //TODO now only on correct response the game will move forward otherwise the current player
        //TODO will keep showing iDontUnderstand pose
    }

    private gameOver() {
        Event.emit(EventType.PlayerPosition, playerPosition.EndPosition);
        window.PopUpManager.show(window.PopUpType.EndScreenPopUp);
    }

    private sendRoundData() {
        if (this.currentRoundData !== undefined) {
            Event.emit(GameFlow.Player, this.currentRoundData)
            this.lastRoundData = this.currentRoundData;
            return;
        }
        if (this.currentRoundData === undefined) {
            Event.emit(GameFlow.Player, this.lastRoundData)
        }
    }

    private getCurrentRoundData() {
        return GameData[this.currentRoundIndex];
    }

    onNewRound() {

        // let playerCharacter = this.allPlayersInGameRef.get(this.currentRoundData.chracter)
        // playerCharacter.node.destroy()
        // this.allPlayersInGameRef.clear();
        if (this.playerHolderNode !== null) this.playerHolderNode.removeAllChildren();
        if (this.allPlayersInGameRef !== null) this.allPlayersInGameRef.clear();
        this.currentRoundIndex++;
        this.startNextRound();
    }

    private setGameUI(currentRoundData: IRoundData) {

    }
    private screenSizeAndPlayerPosition() {
        const screenSize = cc.view.getVisibleSize();
        this.screenVisibleWidth = screenSize.width;
        playerPosition.InItPosition = -((this.screenVisibleWidth / 2) + (this.playerWidth / 2));
        playerPosition.LeftOfScreen = ((this.screenVisibleWidth / 2));
        playerPosition.RightOfScreen = ((this.screenVisibleWidth / 2) + ((this.playerWidth * 3) / 4));
        playerPosition.EndPosition = ((this.screenVisibleWidth) + ((this.playerWidth * 3) / 4));
    }



    private bubbleNodeStartEvent(event: cc.Event.EventTouch) {
        this.isMouseDown = true;
        this.currenttargetBubbleNode = event.getCurrentTarget();
        this.initialBubblePosition = event.getCurrentTarget().getPosition();
    }

    private bubbleNodeMoveEvent(event: cc.Event.EventTouch) {
        //if (this.isMouseDown === true) {
        let delta = event.getDelta();
        if (this.currenttargetBubbleNode.y <= 330 && this.currenttargetBubbleNode.y >= -260) {
            this.currenttargetBubbleNode.y = this.currenttargetBubbleNode.y + delta.y;
        }
        if (this.currenttargetBubbleNode.x <= (this.screenVisibleWidth / 20) && this.currenttargetBubbleNode.x >= -((this.screenVisibleWidth / 3))) {
            this.currenttargetBubbleNode.x = this.currenttargetBubbleNode.x + delta.x;
        }
    }

    private bubbleNodeEndEvent() {
        if (this.currenttargetBubbleNode === null) return;
        this.isMouseDown = false;
        var collide = this.checkIntersection(this.currenttargetBubbleNode, this.bubbleNodePlaceHolder);
        var bubbleHolderMiddlePosition = this.bubbleNodePlaceHolder.getPosition();
        if (collide === true) {
            this.buttonDropInBubbleHolder();
            if (this.lastTargetBubbleNode !== null) {
                this.lastTargetBubbleNode.setPosition(this.initialBubblePositionLastnode);
            }
            this.lastTargetBubbleNode = this.currenttargetBubbleNode;
            this.initialBubblePositionLastnode = this.initialBubblePosition;
            this.currenttargetBubbleNode.setPosition(bubbleHolderMiddlePosition);
        }
        if (collide === false) {
            this.currenttargetBubbleNode.setPosition(this.initialBubblePosition);
        }
    }
    private checkIntersection(aNode: cc.Node, bNode: cc.Node) {
        let aSpacePos = this.node.convertToWorldSpaceAR(aNode.position);
        let aRealPos = this.node.convertToNodeSpaceAR(aSpacePos);
        let bSpacePos = this.node.convertToWorldSpaceAR(bNode.position);
        let bRealPos = this.node.convertToNodeSpaceAR(bSpacePos);
        let aRect = {
            startX: aRealPos.x - (aNode.width / 2),
            endX: aRealPos.x + (aNode.width / 2),
            startY: aRealPos.y - (aNode.height / 2),
            endY: aRealPos.y + (aNode.height / 2)
        }
        if (bRealPos.x >= aRect.startX && bRealPos.x <= aRect.endX && bRealPos.y >= aRect.startY && bRealPos.y <= aRect.endY) {
            return true;
        } else {
            return false;
        }
    }
    private buttonDropInBubbleHolder() {
        //TODO event emit button string to player
        //TODO if the data mactes to promt then start next round otherwise return
        const currentPrompt = this.currenttargetBubbleNode.name;
        if (this.currentRoundData.prompt.localeCompare(currentPrompt) === 0) {
            if (this.currentRoundData.exitSide) {
                let player = this.allPlayersInGameRef.get(this.currentRoundData.chracter)
                player.setExitPosition(this.currentRoundData.exitSide)
                return;
            }
            this.currentRoundIndex++;
            this.startNextRound();

        }
        else {
            Event.emit(EventType.PlayerSprite, PlayerSprite.Angry);
        }
    }
    onAnswerCheck(event, customEventData) {
        if (this.playerHolderNode === null) return;
        if (this.currentRoundData.prompt.localeCompare(customEventData) === 0) {
            if (this.currentRoundData.exitSide) {
                let player = this.allPlayersInGameRef.get(this.currentRoundData.chracter)
                player.setExitPosition(this.currentRoundData.exitSide)
                return;
            }
            this.currentRoundIndex++;
            this.startNextRound();

        }
        else {
            Event.emit(EventType.PlayerSprite, PlayerSprite.Angry);
        }
    }

    private playerInitialAction() {

        this.bottomButtonInteractibility();
    }

    private bottomButtonInteractibility() {
        for (let i = 0; i < this.bottomButtons.length; i++) {
            this.bottomButtons[i].interactable = true;
        }
    }
    private onBubbleButtonHello() {

    }
    private onBubbleButtonGoodBye() {

    }
    private onBubbleButtonIDU() {

    }
    private onBubbleButtonSorry() {

    }

    private onTabletOneButton() {

    }
    private onTabletTwoButton() {

    }
    private onTabletThreeButton() {

    }
    private onToiletButton() {

    }

    private onPauseButtonClick() {
        window.PopUpManager.show(window.PopUpType.GamePausePopUp);
        cc.director.pause();
        console.log("Game Pause")
    }

    private onEndScreenButtonClick() {
        cc.director.pause();
        window.PopUpManager.show(window.PopUpType.EndScreenPopUp);
    }

}
