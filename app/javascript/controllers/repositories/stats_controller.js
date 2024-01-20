import { Controller } from "@hotwired/stimulus"
import { get } from '@rails/request.js'

function showStats(data, canvas, revision, change, title) {
  const chartData = {
    labels: data['labels'],
    datasets: [{
      label: revision,
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1,
      data: data['commits']
    }, {
      label: change,
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgb(54, 162, 235)',
      data: data['changes']
    }]
  };
  new Chart(canvas.getContext("2d"), {
    type: 'bar',
    data: chartData,
    options: {
      elements: {
        bar: {borderWidth: 2}
      },
      responsive: true,
      plugins: {
        legend: {position: 'right'},
        title: {
          display: true,
          text: title
        }
      },
      scales: {
        yAxis: {ticks: {precision: 0}}
      }
    }
  });
}

// Connects to data-controller="repositories--stats"
export default class extends Controller {
  static targets = ['canvas']
  static values = { url: String, revision: String, change: String, title: String }

  connect() {
    get(this.urlValue,
      { responseKind: 'json' }
    ).then(res => {
      if (response.ok) {
        return res.json
      }
    }).then(json => {
      showStats(json, this.canvasTarget, this.revisionValue, this.changeValue, this.titleValue);
    })
  }
}
