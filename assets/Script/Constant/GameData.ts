export const GameData: IRoundData[] = [
    {
        enabledUI: ["Hello"],
        chracter: "C1",
        prompt: "Hello",
        pose: 4,
        enteringSide: "left",
    },
    {
        enabledUI: ["Hello", "Numbers"],
        chracter: "C1",
        prompt: "1Pax",
        pose: 1,
        exitSide: "right"
    },
]

export interface IRoundData {
    enabledUI?: string[]
    chracter?: string
    prompt?: string
    pose?: number
    enteringSide?: string
    exitSide?: string
}