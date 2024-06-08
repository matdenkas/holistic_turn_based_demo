export const enum Constants {
    // Size of the main window
    WIDTH = 2000,
    HEIGHT = 1000,

    // X, Y, Width, Height of all main window components
    INFO_X = 0,
    INFO_Y = 0,
    INFO_W = 0.2 * WIDTH,
    INFO_H = HEIGHT,

    BOARD_X = INFO_W,
    BOARD_Y = 0,
    BOARD_W = 0.6 * WIDTH,
    BOARD_H = 0.8 * HEIGHT,

    ACTION_X = INFO_W,
    ACTION_Y = BOARD_H,
    ACTION_W = BOARD_W,
    ACTION_H = 0.2 * HEIGHT,

    LOG_X = BOARD_X + BOARD_W,
    LOG_Y = 0,
    LOG_W = 0.2 * WIDTH,
    LOG_H = HEIGHT
}

export const enum Colors {
    // Placeholders for putting action content
    LIGHT_CYAN = 0xb7edea,
    LIGHT_BLUE = 0xacd5f2,
    LIGHT_RED = 0xf09f86,
    LIGHT_PINK = 0xedbff2,

    BLACK = 'black',
}