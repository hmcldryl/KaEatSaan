# [1.2.0-beta.11](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.10...v1.2.0-beta.11) (2026-06-29)


### Features

* polish gamified home screen UI ([26ab454](https://github.com/hmcldryl/KaEatSaan/commit/26ab454c23823b50a01dad879cea246282b19bfd)), closes [#FF6B35](https://github.com/hmcldryl/KaEatSaan/issues/FF6B35)
* redesign home screen with gamified PWA UI ([d343067](https://github.com/hmcldryl/KaEatSaan/commit/d343067862377efe95474d4f4658483110475a70))
* **ui:** overhaul home screen and make layout fully responsive ([1548050](https://github.com/hmcldryl/KaEatSaan/commit/1548050f9e019cb17309bbbea759511e021f4e12))
* **wheel:** polish UI, optimize canvas perf, update primary color ([65e0a9e](https://github.com/hmcldryl/KaEatSaan/commit/65e0a9ecc2604c580b62578b089ffd87b1a65bdb)), closes [#E37725](https://github.com/hmcldryl/KaEatSaan/issues/E37725) [#FF6B35](https://github.com/hmcldryl/KaEatSaan/issues/FF6B35)

# [1.2.0-beta.10](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.9...v1.2.0-beta.10) (2026-06-28)


### Bug Fixes

* **ci:** handle already-active-version error with post-deploy site check ([dc36f5e](https://github.com/hmcldryl/KaEatSaan/commit/dc36f5ed7e94e4afee43c8c1de61e759daa32eba))

# [1.2.0-beta.9](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.8...v1.2.0-beta.9) (2026-06-28)


### Bug Fixes

* **ci:** add nanosecond timestamp to build-id.txt for unique Firebase versions ([e56aa9e](https://github.com/hmcldryl/KaEatSaan/commit/e56aa9e20ac3af1b205b7dc290a6516956b45132))

# [1.2.0-beta.8](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.7...v1.2.0-beta.8) (2026-06-28)


### Bug Fixes

* **ci:** stamp out/ with commit SHA after build to force unique Firebase version ([8b176ea](https://github.com/hmcldryl/KaEatSaan/commit/8b176ea24b3bec794053dcd21f2943a55984d1c1))

# [1.2.0-beta.7](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.6...v1.2.0-beta.7) (2026-06-28)


### Bug Fixes

* **ci:** use generateBuildId to guarantee unique Firebase versions per commit ([5b1cf4c](https://github.com/hmcldryl/KaEatSaan/commit/5b1cf4c900cada66482dbf3071f3317111adcd42))

# [1.2.0-beta.6](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.5...v1.2.0-beta.6) (2026-06-28)


### Bug Fixes

* **ci:** pass NEXT_PUBLIC_BUILD_ID explicitly from github.sha in build step ([e3a5d57](https://github.com/hmcldryl/KaEatSaan/commit/e3a5d57a1478ef784dd369123a243d9ed2c7f0de))


### Features

* **map:** custom styled tiles, animated marker, and entry animation ([4276228](https://github.com/hmcldryl/KaEatSaan/commit/427622837ab21f8daa5136bf46fca5d97d55b982))

# [1.2.0-beta.5](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.4...v1.2.0-beta.5) (2026-06-28)


### Bug Fixes

* **ci:** inject GITHUB_SHA into bundle to guarantee unique Firebase versions ([cdd1b70](https://github.com/hmcldryl/KaEatSaan/commit/cdd1b702aade7499bcb09660c0d31272a8950826))

# [1.2.0-beta.4](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.3...v1.2.0-beta.4) (2026-06-28)


### Bug Fixes

* **ci:** skip build/deploy when semantic-release cuts no new release ([43ef001](https://github.com/hmcldryl/KaEatSaan/commit/43ef001d2141f5b338d97435208c8fb250ea8e17))

# [1.2.0-beta.3](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.2...v1.2.0-beta.3) (2026-06-28)


### Bug Fixes

* **ci:** remove environment context from release and notify jobs ([5ef3bd7](https://github.com/hmcldryl/KaEatSaan/commit/5ef3bd7a7218c7f012b0fa4dbe159b6254fdfc17))

# [1.2.0-beta.2](https://github.com/hmcldryl/KaEatSaan/compare/v1.2.0-beta.1...v1.2.0-beta.2) (2026-06-28)


### Bug Fixes

* **ci:** add environment context to build job for secret access ([532cc03](https://github.com/hmcldryl/KaEatSaan/commit/532cc038b706f765fbb518d9f10d06e753143386))

# [1.2.0-beta.1](https://github.com/hmcldryl/KaEatSaan/compare/v1.1.1-beta.3...v1.2.0-beta.1) (2026-06-28)


### Bug Fixes

* **ci:** fix git auth for semantic-release by setting remote URL explicitly ([067b371](https://github.com/hmcldryl/KaEatSaan/commit/067b3713b0031c017f6cfad0e3351215996355f4))
* resolve bugs, lint errors, and update docs ([940dcd8](https://github.com/hmcldryl/KaEatSaan/commit/940dcd8fd463771304192f09a9f227870c7123c0))


### Features

* update branding, theme colors, and curvy MUI style ([f668ffc](https://github.com/hmcldryl/KaEatSaan/commit/f668ffc37765cffa745dcbccd4d31d0009e35275)), closes [#FF6B35](https://github.com/hmcldryl/KaEatSaan/issues/FF6B35) [#E37725](https://github.com/hmcldryl/KaEatSaan/issues/E37725) [#FFF8F2](https://github.com/hmcldryl/KaEatSaan/issues/FFF8F2) [#F0DFD0](https://github.com/hmcldryl/KaEatSaan/issues/F0DFD0)

## [1.1.1-beta.3](https://github.com/hmcldryl/KaEatSaan/compare/v1.1.1-beta.2...v1.1.1-beta.3) (2026-04-21)


### Bug Fixes

* resolve TypeScript build errors in RouletteWheel and AppLayout ([07f44e3](https://github.com/hmcldryl/KaEatSaan/commit/07f44e3320cc5855ddef3123aa376ce0b14be449))

## [1.1.1-beta.2](https://github.com/hmcldryl/KaEatSaan/compare/v1.1.1-beta.1...v1.1.1-beta.2) (2026-04-21)


### Bug Fixes

* roleta alignment on wide screens, update .gitignore file ([1219f94](https://github.com/hmcldryl/KaEatSaan/commit/1219f94c44621d53508c3643b40830c9beb6a3da))

## [1.1.1-beta.1](https://github.com/hmcldryl/KaEatSaan/compare/v1.1.0...v1.1.1-beta.1) (2026-01-26)


### Bug Fixes

* align wheel result calculation with visual display ([5c50c57](https://github.com/hmcldryl/KaEatSaan/commit/5c50c57f905b2ac81dc9888c36d77d248ce7b884))
* calculate wheel result from exact final rotation value ([15a49b9](https://github.com/hmcldryl/KaEatSaan/commit/15a49b9fb0aef0ca6f9b023e0b935952c26d9bdb))

# [1.1.0](https://github.com/hmcldryl/KaEatSaan/compare/v1.0.0...v1.1.0) (2026-01-25)


### Bug Fixes

* configure checkout to use PAT for git push credentials ([161172f](https://github.com/hmcldryl/KaEatSaan/commit/161172f72a75800ae15e5263b5db1a8b57650d5e))
* update node version to 22 for semantic-release compatibility ([fd59d7e](https://github.com/hmcldryl/KaEatSaan/commit/fd59d7e5f18e631a9c4bf745fe4fd71cb9f1c38f))
* use PAT for semantic-release to bypass branch protection ([a5e881f](https://github.com/hmcldryl/KaEatSaan/commit/a5e881f2ff6ffa7c7082313ff888297afdd74d91))


### Features

* add automatic versioning ([4d16149](https://github.com/hmcldryl/KaEatSaan/commit/4d161491d8b87ca2700e977075d6b4fd19320636))
* add discord webhook notifications for deployments ([fc08383](https://github.com/hmcldryl/KaEatSaan/commit/fc08383dc3d06a5cb1b7de2119bd4e3d9d6f2470))
* add semantic versioning with auto-increment on develop and main ([9ecdbfd](https://github.com/hmcldryl/KaEatSaan/commit/9ecdbfdec16f07b336e90ac60e86b8a253683659))

# [1.1.0-beta.4](https://github.com/hmcldryl/KaEatSaan/compare/v1.1.0-beta.3...v1.1.0-beta.4) (2026-01-25)


### Bug Fixes

* configure checkout to use PAT for git push credentials ([161172f](https://github.com/hmcldryl/KaEatSaan/commit/161172f72a75800ae15e5263b5db1a8b57650d5e))

# [1.1.0-beta.3](https://github.com/hmcldryl/KaEatSaan/compare/v1.1.0-beta.2...v1.1.0-beta.3) (2026-01-25)


### Bug Fixes

* use PAT for semantic-release to bypass branch protection ([a5e881f](https://github.com/hmcldryl/KaEatSaan/commit/a5e881f2ff6ffa7c7082313ff888297afdd74d91))

# [1.1.0-beta.2](https://github.com/hmcldryl/KaEatSaan/compare/v1.1.0-beta.1...v1.1.0-beta.2) (2026-01-25)


### Features

* add discord webhook notifications for deployments ([fc08383](https://github.com/hmcldryl/KaEatSaan/commit/fc08383dc3d06a5cb1b7de2119bd4e3d9d6f2470))

# [1.1.0-beta.1](https://github.com/hmcldryl/KaEatSaan/compare/v1.0.0...v1.1.0-beta.1) (2026-01-25)


### Bug Fixes

* update node version to 22 for semantic-release compatibility ([fd59d7e](https://github.com/hmcldryl/KaEatSaan/commit/fd59d7e5f18e631a9c4bf745fe4fd71cb9f1c38f))


### Features

* add automatic versioning ([4d16149](https://github.com/hmcldryl/KaEatSaan/commit/4d161491d8b87ca2700e977075d6b4fd19320636))
* add semantic versioning with auto-increment on develop and main ([9ecdbfd](https://github.com/hmcldryl/KaEatSaan/commit/9ecdbfdec16f07b336e90ac60e86b8a253683659))
