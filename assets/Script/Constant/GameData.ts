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

    },
    {
        enabledUI: ["Hello", "Numbers"],
        chracter: "C1",
        prompt: "2Pax",
        pose: 2,
        exitSide: "right"
    },
    {
        enabledUI: ["Hello", "Numbers"],
        chracter: "C2",
        prompt: "3Pax",
        pose: 3,
        enteringSide: "right",

    },
    {
        enabledUI: ["Hello", "Numbers"],
        chracter: "C2",
        prompt: "Toilet",
        pose: 0,

    },
    {
        enabledUI: ["Hello", "Numbers"],
        chracter: "C2",
        prompt: "GoodBye",
        pose: 5,
        exitSide: "left"
    },
    {
        enabledUI: ["Hello", "Numbers"],
        chracter: "C1",
        prompt: "IDon'tUnderstand",
        pose: 6,
        enteringSide: "left",

    },
    {
        enabledUI: ["Hello", "Numbers"],
        chracter: "C1",
        prompt: "Angry",
        pose: 7,

    }
]

export interface IRoundData {
    enabledUI?: string[]
    chracter?: string
    prompt?: string
    pose?: number
    enteringSide?: string
    exitSide?: string
}