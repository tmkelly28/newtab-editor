const {ace} = window
const editor = ace.edit('editor')
const output = document.getElementById('output')
const DARK_THEME = 'monokai'
const LIGHT_THEME = 'chrome'
const br = '<br />'
editor.setTheme(`ace/theme/${DARK_THEME}`)
editor.getSession().setMode('ace/mode/javascript')
editor.setKeyboardHandler('ace/keyboard/vim')
editor.setShowPrintMargin(false)

let logs = []
const originalConsoleLog = window.console.log.bind(console)
window.console.log = (...args) => {
  logs.push(...args)
  originalConsoleLog(...args)
}

const handleResult = (result) => {
  originalConsoleLog(result)
  logs.push(result)
  output.innerHTML = logs.join(br)
  originalConsoleLog(logs)
  logs = []
}

editor.commands.addCommand({
  name: 'exec',
  bindKey: {win: 'Ctrl-E', mac: 'Command-E'},
  exec (editor) {
    handleResult(eval(editor.getValue()))
  },
  readOnly: true // false if this command should not apply in readOnly mode
})

editor.commands.addCommand({
  name: 'change-mode',
  bindKey: {win: 'Ctrl-M', mac: 'Command-M'},
  exec (editor) {
    const [,, theme] = editor.getTheme().split('/')
    theme === DARK_THEME
      ? editor.setTheme(`ace/theme/${LIGHT_THEME}`)
      : editor.setTheme(`ace/theme/${DARK_THEME}`)
  },
  readOnly: true // false if this command should not apply in readOnly mode
})
