# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name = "baz_plugin"
  spec.version = "0.0.1"
  spec.authors = ["johndoe"]
  spec.email = ["johndoe@example.org"]

  spec.summary = "Test plugin"
  spec.description = "Test plugin"
  spec.homepage = "https://example.org"
  spec.required_ruby_version = ">= 2.6.0"

  spec.metadata["allowed_push_host"] = "https://example.org"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://example.org"
  spec.metadata["changelog_uri"] = "https://example.org"
  spec.metadata["redmine_plugin"] = "1.0"

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    `git ls-files -z`.split("\x0").reject do |f|
      (f == __FILE__) || f.match(%r{\A(?:(?:bin|test|spec|features)/|\.(?:git|travis|circleci)|appveyor)})
    end
  end
  spec.bindir = "exe"
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]
end
