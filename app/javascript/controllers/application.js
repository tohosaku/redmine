import { Application } from '@hotwired/stimulus'
import { matched, guardUnmatch } from "helper"

const application = Application.start()

application.registerActionOption("matched", matched)
application.registerActionOption("guardUnmatch", guardUnmatch)

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }
