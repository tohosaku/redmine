module TurboStreamActionsHelper
  def hide_modal(target = nil)
    modal = target || 'ajax-modal'
    data = {
      modal_target: 'hide'
    }
    append(modal) { tag.template nil, data: data }
  end

  def hide(target)
    append target do
      tag.template data: {visibility_target: 'dummy', force: 'false'}
    end
  end
end
