# frozen_string_literal: true

# Redmine - project management software
# Copyright (C) 2006-2023  Jean-Philippe Lang
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

module Redmine
  module Helpers
    module Tree

      def self.build(objects, &block)
        return nil unless objects.any?

        objects.sort_by(&:lft).inject(Redmine::Helpers::Tree::Root.new(block)) do |root, obj|
          root.add Redmine::Helpers::Tree::Item.new(obj, block)
        end
      end

      class Item
        attr_reader :object, :children
        attr_accessor :classes, :root

        def initialize(object, block=nil)
          @object = object
          @block = block
          @classes = []
          @root = false
        end

        def render_in(context)
          context.capture(self, &@block)
        end

        def content(context)
          if children.present?
            context.render(self)
          else
            ''
          end
        end

        def add_child(child)
          @children ||=[]
          @children << child
        end

        def ancestor_of?(object)
          object.is_descendant_of? @object
        end
      end

      class Root < Item
        attr_reader :ancestors

        def initialize(block)
          @ancestors = []
          super(nil, block)
        end

        def add(item)
          while ancestors.last && !ancestors.last.ancestor_of?(item.object)
            ancestors.pop
          end
          if ancestors.any?
            item.classes << 'child'
            ancestors.last.add_child item
          else
            item.classes << 'root'
            add_child item
            item.root = true
          end
          ancestors << item
          self
        end
      end
    end
  end
end

