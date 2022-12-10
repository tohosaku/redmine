module TurboStreamActionsHelper
  def hide_modal(target = nil)
    modal = target || 'ajax-modal'
    data = {
      modal_target: 'hide'
    }
    append(modal) { tag.template nil, data: data }
  end

  def hide(target)
    turbo_stream_action_tag :hide, target: target
  end

  def show(target)
    turbo_stream_action_tag :show, target: target
  end

  def focus(target)
    turbo_stream_action_tag :focus, target: target
  end

  def clear(target)
    turbo_stream_action_tag :clear, target: target
  end
end
