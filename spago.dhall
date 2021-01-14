{ name = "halogen-project"
, dependencies =
  [ "console", "effect", "halogen", "halogen-css", "psci-support" ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
