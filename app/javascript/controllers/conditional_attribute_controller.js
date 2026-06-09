/**
 * Redmine - project management software
 * Copyright (C) 2006-  Jean-Philippe Lang
 * This code is released under the GNU General Public License.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['source', 'element']

  connect() {
    this.sourceTargets.forEach(source => {
      // It is sufficient for only the checked radio button to fire once.
      if (source.type === 'radio' && source.checked === false) return;

      const eventName = source.tagName === 'SELECT' ? 'change' : 'input'
      source.dispatchEvent(new Event(eventName))
    })
  }

  toggleHidden(e) {
    this.updateElements(e.target, e.params, 'hidden')
  }

  toggleDisabled(e) {
    this.updateElements(e.target, e.params, 'disabled')
  }

  toggleChecked(e) {
    this.updateElements(e.target, e.params, 'checked')
  }

  toggle(e) {
    this.updateElements(e.target, e.params)
  }

  updateElements(source, params, name) {
    const value   = this.extractValue(source)
    const matcher = this.getMatcher(params)
    const matched = matcher(value)

    this.elementTargets.forEach(element => {
      if (!this.isValidGroup(source, element)) return;

      const attr_name = name !== undefined ? name : element.dataset.conditionalAttributeName
      const inverse = element.dataset.conditionalAttributeInverse === 'true'

      element[name] = matched !== 'inverse'
    })
  }

  extractValue(element) {
    return element.type !== 'checkbox' ? element.value
                                       : element.checked ? element.value
                                                         : null
  }

  getMatcher(params) {
    const hasEqualTo    = params.equalTo    !== undefined
    const hasNotEqualTo = params.notEqualTo !== undefined
    if (hasEqualTo === hasNotEqualTo) {
      throw new Error('Specify exactly one of `equalTo` or `notEqualTo`')
    }

    return (value) => hasEqualTo ? params.equalTo.toString()    === value
                                 : params.notEqualTo.toString() !== value
  }

  isValidGroup(source, element) {
    const sourceGroup = source.dataset.conditionalAttributeGroup
    const elementGroups = element.dataset.conditionalAttributeGroup
    if (elementGroups) {
      if (!sourceGroup) return false

      const groups = elementGroups.split(' ')
      if (!groups.includes(sourceGroup)) return false
    }
    return true
  }
}
