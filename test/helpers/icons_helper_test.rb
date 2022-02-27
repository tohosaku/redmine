# frozen_string_literal: true

# Redmine - project management software
# Copyright (C) 2006-2022  Jean-Philippe Lang
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

require File.expand_path('../../test_helper', __FILE__)

class IconsHelperTest < Redmine::HelperTest
  def setup
    Rails.application.config.redmine_enable_svg_icon = true
    ENV["RAILS_ASSET_ID"] = 'test'
  end

  def teardown
    Rails.application.config.redmine_enable_svg_icon = false
    ENV.delete('RAILS_ASSET_ID')
  end

  def test_common_svg_icon
    html = '<a class="icon icon-add icon-svg" href="/test"><svg class="s16" xmlns="http://www.w3.org/2000/svg"><use href="/icons/circle-plus.svg?test#icon"></use></svg>test</a>'
    assert_equal html, link_to('test', '/test', class: "icon icon-add")
  end

  def test_class_attrs_as_array
    html = '<a class="icon icon-add icon-svg" href="/test"><svg class="s16" xmlns="http://www.w3.org/2000/svg"><use href="/icons/circle-plus.svg?test#icon"></use></svg>test</a>'
    assert_equal html, link_to('test', '/test', class: %w(icon icon-add))
  end

  def test_file_svg_icon
    html = '<a class="icon icon-file text-x-ruby icon-svg" href="/test.rb"><svg class="s16" xmlns="http://www.w3.org/2000/svg">' \
           '<use href="/icons/language-ruby.svg?test#icon"></use></svg>test.rb</a>'
    assert_equal html, link_to('test.rb', '/test.rb', class: "icon icon-file text-x-ruby")
  end

  def test_unknown_svg_icon
    html = '<a class="icon icon-foo" href="/test"><!-- SVG icon-foo not found -->test</a>'
    assert_equal html, link_to('test', '/test', class: "icon icon-foo")
  end
end
