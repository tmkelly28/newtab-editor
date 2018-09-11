const {ace} = window
const editor = ace.edit('editor')
const editorDomNode = document.getElementById('editor')
const output = document.getElementById('output')
const outputContainer = document.getElementById('output-container')
const clock = document.getElementById('clock')
const clockDt = document.getElementById('clock-dt')
const bgDark = 'rgb(47, 49, 42)'
const bgLight = 'rgb(255, 255, 255)'
const DARK_THEME = 'monokai'
const LIGHT_THEME = 'chrome'
editor.setTheme(`ace/theme/${DARK_THEME}`)
editor.getSession().setMode('ace/mode/javascript')
editor.setKeyboardHandler('ace/keyboard/vim')
editor.setShowPrintMargin(false)

// editor

const stringify = thing => {
  const type = typeof thing
  switch (type) {
    case 'undefined':
      return 'undefined'
    case 'object':
      return !thing
        ? 'null'
        : Array.isArray(thing)
          ? `[${thing.map(stringify).join(',')}]`
          : JSON.stringify(thing)
    default:
      return thing.toString()
  }
}

const originalConsoleLog = window.console.log.bind(console)
const newConsoleLog = (...args) => {
  originalConsoleLog(...args)
  args.map(stringify).forEach(arg => {
    output.appendChild(document.createTextNode(arg))
    output.appendChild(document.createElement('br'))
  })
}

window.console.log = newConsoleLog

const handleResult = (result) => {
  if (result instanceof Promise) {
    return result.then(handleResult, handleResult)
  }
  newConsoleLog('=> ' + stringify(result))
}

editor.commands.addCommand({
  name: 'exec',
  bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
  exec (editor) {
    try {
      output.innerHTML = ''
      handleResult(eval(editor.getValue()))
    } catch (err) {
      handleResult(err.message)
    }
  },
  readOnly: true // false if this command should not apply in readOnly mode
})

editor.commands.addCommand({
  name: 'change-mode',
  bindKey: {win: 'Ctrl-M', mac: 'Command-M'},
  exec (editor) {
    const [,, theme] = editor.getTheme().split('/')
    if (theme === DARK_THEME) {
      editor.setTheme(`ace/theme/${LIGHT_THEME}`)
      outputContainer.style.backgroundColor = bgLight
      outputContainer.style.color = 'black'
      clock.style.backgroundColor = bgLight
    } else {
      editor.setTheme(`ace/theme/${DARK_THEME}`)
      outputContainer.style.backgroundColor = bgDark
      outputContainer.style.color = 'white'
      clock.style.backgroundColor = bgDark
    }
  },
  readOnly: true // false if this command should not apply in readOnly mode
})

// clock

const pad = (t) => `${t}`.length < 2 ? `0${t}` : t
const setDate = () => {
  const d = new Date()
  const hour = pad(d.getHours())
  const min = pad(d.getMinutes())
  const sec = pad(d.getSeconds())

  clockDt.innerText = `${hour}:${min}:${sec}`
}

// main
const main = () => {
  setDate()
  setInterval(setDate, 1000)
  const domNodes = [editorDomNode, outputContainer, clock]
  domNodes.forEach(node => {
    const originalOpacity = node.style.opacity

    node.addEventListener('mouseenter', () => {
      node.style.opacity = '0.9'
    })

    node.addEventListener('mouseleave', () => {
      node.style.opacity = originalOpacity
    })
  })
}

main()
