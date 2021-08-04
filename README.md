# babel-plugin-au-import

`au-ui` 组件库的按需引入 `babel` 插件

## 使用

安装 `npm install babel-plugin-au-import -D`

```js
// .babelrc
{
  "plugins": [
    ["babel-plugin-au-import"]
  ]
}

```

### 可加参数

```js
{
  libraryName: 'au-ui', // 引入的组件库名
  style (name) { // 引入的样式，若返回false，则不引入css
    return `au-ui/packages/${name}/${name}.css`
  },
  customName (name) { // 引入的组件
    return `au-ui/packages/${name}`
  }
}
```

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      "babel-plugin-au-import",
      {
        libraryName: 'au-ui', // 引入的组件库名
        style (name) => flase,
        customName (name) { // 引入的组件
          return `au-ui/packages/${name}`
        }
      }
    ]
  ]
}
```