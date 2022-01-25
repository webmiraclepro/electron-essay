const { ipcRenderer } = require('electron')
// const { ctre } = require('./services/domremove.service.js')
const { ctre } = require('./domremove.service.js')

ipcRenderer.on('activate_domRemoveMode', () => {
	console.log('activate_domRemoveMode')
	ctre.activate()
  	ipcRenderer.sendToHost('activate_domRemoveMode')
})

ipcRenderer.on('deactivate_domRemoveMode', () => {
	ctre.deactivate()
	const savedElements = ctre.updateSavedElements()
	const settings = ctre.saveSettings()

	ipcRenderer.sendToHost('save_hiddenElements', savedElements)
	ipcRenderer.sendToHost('save_settings', settings)
	ipcRenderer.sendToHost('deactivate_domRemoveMode')
})

ipcRenderer.on('load_hiddenElements', (e, data) => {
	console.log('load_hiddenElements')
	ctre.loadSavedElements(data.savedElements, data.settings)
})

ipcRenderer.on('refresh-webview', () => {
	console.log('refresh-webview')
	ctre.loadSavedElements([], { remember: true })
})
