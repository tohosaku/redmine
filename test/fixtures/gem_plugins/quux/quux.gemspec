# frozen_string_literal: true

Gem::Specification.new do |spec|

  # Do not use constants or variables from the gem's own code in this block, as is normally
  # done with gems. (e.g. Foo::VERSION)
  # Specify the version of redmine or dependencies between plugins in the init.rb file.

  spec.name = "quux"
  spec.version = "0.0.1"
  spec.authors = ["johndoe"]
  spec.email = ["johndoe@example.org"]

  spec.summary = "Quux plugin"
  spec.description = "This is a plugin for Redmine"
  spec.homepage = "https://example.org"
  spec.required_ruby_version = ">= 2.7.0"

  spec.metadata["author_url"] = spec.homepage
  spec.files = Dir["{lib}/**/*", "init.rb", "Gemfile"]

  # DO NOT DELETE this attribute
  spec.metadata["redmine_plugin_id"] = "quux_plugin"
end
