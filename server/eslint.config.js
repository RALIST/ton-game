const tseslint = require('typescript-eslint')

module.exports = tseslint.config(
    ...tseslint.configs.recommended
)
