const { loadScript, bitloginMenu,desactivaBtns, activaBtns, muestraLogOut, bitlogin, deviceKeys } = require('./bitlogin.js')
require('./bitlogin-hc.js')
require('./bitlogin-mb.js')
require('./bitlogin-rx.js')
require('./bitlogin-dot.js')
require('./bitlogin-sensilet.js')
require('./bitlogin-volt.js')

module.exports={
    loadScript,
    bitlogin,
    bitloginMenu,
    activaBtns,
    desactivaBtns,
    deviceKeys
}

