import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="repositories--revision-graph"
export default class extends Controller {
  static values = { space:Number }

  connect() {
    this.handle();
  }

  handle(e){
    const commits = document.getElementById('commits_json');
    const json = JSON.parse(commits.textContent);
    drawRevisionGraph(this.element, json, this.spaceValue);
  }
}
