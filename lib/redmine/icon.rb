# frozen_string_literal: true

# Redmine - project management software
# Copyright (C) 2006-2021  Jean-Philippe Lang
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

require 'yaml'

module Redmine
  module Icon
    module Helper
      def expander
        tag.span '&nbsp;', class: ['expander', 'icon', 'icon-expanded'], onclick: 'toggleRowGroup(this);'
      end

      def collapsible(is_new_record)
        css_class = is_new_record ? 'icon-expanded' : 'icon-collapsed'
        ['icon', css_class]
      end

      def preload_icon_link(name)
        if Rails.application.config.redmine_enable_svg_icon
          icon_path = "#{Redmine::Utils.relative_url_root}#{icon_set_path(name)}"
          preload_link_tag(icon_path, as: 'fetch', id: "#{name}_icon_path", crossorigin: "anonymous", type: "application/json")
        else
          ''
        end
      end
    end

    module Patch
      # link_to 'test', '/test', class: "icon icon-add"
      # => <a class="icon icon-add icon-svg" href="/test">
      #      <svg class="s16" xmlns="http://www.w3.org/2000/svg"><use href="/icons/plus-circle.svg#icon"></use></svg>test
      #    </a>
      #
      # link_to 'test.rb', '/test.rb', class: "icon icon-file text-x-ruby"
      # => <a class="icon icon-file text-x-ruby icon-svg" href="/test.rb">
      #      <svg class="s16" xmlns="http://www.w3.org/2000/svg"><use href="/icons/language-ruby.svg#icon"></use></svg>test.rb
      #    </a>
      #
      # # when svg icon is not found
      #
      # link_to 'test', '/test', class: "icon icon-foo"
      # => <a href="/test" class="icon icon-foo"><!-- SVG icon-foo not found -->test</a>
      #
      def content_tag_string(name, content, options, escape = true)
        return super unless need_process?(name, options)

        processed = content_with_icon(content, options, escape)
        super name, processed, options, escape
      end
      DEFAULT_SVG_CSS_CLASS = 's16'
      FILE_TYPE_REGEXP = /(text-|image-|application-)/.freeze
      XMLNS = 'http://www.w3.org/2000/svg'

      private

      def need_process?(name, options)
        Rails.application.config.redmine_enable_svg_icon &&
        name != :use && name != :svg && options.present? &&
        (options[:class].present? || options['class'].present?)
      end

      def content_with_icon(content, options, escape)
        options.symbolize_keys!
        classes = split_tokens options[:class]
        icon = classes.include?('icon')
        icon_only = classes.include?('icon-only')
        return content unless icon || icon_only

        svg = create_svg_icon(classes, options)
        (icon_only ? svg : "#{svg}#{content}").html_safe
      end

      # copy from ActionView::Helpers::TagHelper#token_list
      def split_tokens(*args)
        ActionView::Helpers::TagHelper.build_tag_values(*args).flat_map { |value| value.to_s.split(/\s+/) }.uniq
      end

      def create_svg_icon(classes, options)
        icon_name = classes.find { |c| c != 'icon-only' && c.start_with?('icon-') }
        file_type = classes.find { |c| c.start_with?(FILE_TYPE_REGEXP) }
        svg = fetch_svg(icon_name, file_type)
        if svg.present?
          classes << 'icon-svg'
          options[:class] = classes.join(' ')
          svg
        else
          "<!-- SVG #{file_type || icon_name} not found -->"
        end
      end

      def fetch_svg(icon_name, file_type)
        if icon_name == 'icon-file' && file_type
          svg_tag(file_type, DEFAULT_SVG_CSS_CLASS, IconSet.fetch('file'))
        else
          svg_tag(icon_name, DEFAULT_SVG_CSS_CLASS, IconSet.fetch('common'))
        end
      end

      def svg_tag(name, css_class, icon_map)
        return '' unless icon_map.key?(name)

        content = content_tag_string(:use, nil, { :href => "#{icon_map[name]}#icon" })
        content_tag_string(:svg, content, { :class => css_class, :xmlns => XMLNS })
      end
    end

    module MapLoader
      def load_icon_map
        pattern = File.join icon_config_dir, '*.{yaml,yml}'
        Dir.glob(pattern).each_with_object({}) do |f, o|
          name    = File.basename f, '.*'
          value   = YAML.safe_load(File.open(Rails.root.join(f)))
          o[name] = value.transform_values { |e| path_to_asset File.join(icon_dir, e) }
        end
      end
    end
  end
end
