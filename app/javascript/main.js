import "controllers"
import {createTooltip} from 'tooltip';

document.addEventListener('mouseover', (e) => {
  const tooltip = createTooltip()
  tooltip.show(e)
});
