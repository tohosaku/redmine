import { Controller } from "@hotwired/stimulus"
import {jsonContent} from 'helper'

// Connects to data-controller="repositories--revision-graph"
export default class extends Controller {
  static values = { space:Number }

  connect() {
    this.handle();
  }

  handle(e){
    import('revision_graph').then(mod => {
      const commits = jsonContent('commits_json');
      mod.drawRevisionGraph(this.element, commits, this.spaceValue);
    })
  }
}
