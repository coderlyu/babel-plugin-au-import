const t = require('@babel/types')

function transformName (n) {
  return n.split('').reduce((p, c, i) => {
    if (i === 0) return c.toLocaleLowerCase()
    else if (/^[A-Z]$/.test(c)) return p + '-' + c.toLocaleLowerCase()
    else if (/^\d$/.test(c)) return /^\d$/.test(p.charAt(p.length - 1)) ? (p + c) : (p + '-' + c)
    return p + c
  }, '')
}

const defaultOpts = {
  libraryName: 'au-ui',
  style (name) {
    return false
    // return `${defaultOpts.libraryName}/packages/${transformName(name)}/${transformName(name)}.css`
  },
  customName (name) {
    return `${defaultOpts.libraryName}/packages/${transformName(name)}`
  }
}

module.exports = function ({ type }) {
  return {
    visitor: {
      ImportDeclaration (path, { opts = {} }) {
        Object.assign(defaultOpts, opts)
        const { node } = path
        if (!node) return
        const { source: { value: libName }, specifiers = [] } = node
        const imports = []
        if (defaultOpts.libraryName === libName) { // import 引入的库名和 libraryName 相同进入
          specifiers.forEach(item => {
            if (t.isImportSpecifier(item)) {
              const { imported: { name: importedName }, local: { name: localName } } = item
              if (!importedName || !localName) return
              if (path.scope.getBinding(localName).references === 0) return // 当前变量没有使用到，直接抛弃
              // 组件
              // import { Roll } from 'au-ui' => import Roll from 'au-ui/packages/roll
              imports.push(t.importDeclaration([t.importDefaultSpecifier(t.identifier(localName))], t.StringLiteral(defaultOpts.customName(importedName))))
              // css
              if (typeof defaultOpts.style === 'function' && defaultOpts.style(importedName)) {
                imports.push(t.importDeclaration([], t.StringLiteral(defaultOpts.style(importedName))))
              }
            }
          })
          path.replaceWithMultiple(imports) // 替换成改变后的引入方式
        }
      }
    }
  }
}