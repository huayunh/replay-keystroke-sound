export const PRESETS = {
    'Preset A': [
        ['s003', 's004'],
        ['s024', 's036'],
        ['s041', 's057'],
        ['s002', 's032'],
    ],
    'Preset B': [
        ['s002', 's032'],
        ['s024', 's036'],
        ['s031', 's056'],
        ['s003', 's004'],
        ['s041', 's057'],
    ],
    'Preset C': [
        ['s003', 's004'],
        ['s003', 's003'],
        ['s008', 's010'],
        ['s007', 's008'],
        ['s022', 's024'],
        ['s015', 's013'],
        ['s018', 's010'],
    ],
    'Time Stretch': [
        ['s002', 's036'],
        ['s002', 's002_0.85x'],
        ['s002', 's002_1.15x'],
        ['s002', 's002_0.90x'],
        ['s002', 's002_1.10x'],
        ['s002', 's002_0.95x'],
        ['s002', 's002_1.05x'],
        ['s002', 's002'],
    ],
    'Add Time': [
        ['s002', 's036'],
        ['s002', 's002_DDie+800ms'],
        ['s002', 's002_DDie+400ms'],
        ['s002', 's002_DDShift.ro+200ms'],
        ['s002', 's002_DDoa+150ms'],
        ['s002', 's002_DDfiveShift.r+100ms'],
        ['s002', 's002_DDti+50ms'],
        ['s002', 's002'],
    ],
};
export const PRESET_KEYS = Object.keys(PRESETS);
