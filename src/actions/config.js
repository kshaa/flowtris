/**
 * Action types
 */
export const CONFIG_NICK = 'CONFIG_NICK'
export const CONFIG_TIMEOUT = 'CONFIG_TIMEOUT'

/**
 * Action creators
 */
export const configNick = (nick) => {
    return {
        type: CONFIG_NICK,
        nick
    }
}

export const configTimeout = (timeout) => {
    return {
        type: CONFIG_TIMEOUT,
        nick
    }
}

