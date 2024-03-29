let babel = require('babel-core');
let t = require('babel-types');
// 字符串的替换
const template = require('babel-template');
const generate = require("babel-generator").default;

const transform = (str) => {
  return str.replace(/'DEFINE_STRING'/g, 'string')
    .replace(/'DEFINE_NUMBER'/g, 'number')
    .replace(/'DEFINE_BOOLEAN'/g, 'boolean')
} 

const toUpperCase = (str) => str.replace(/[a-zA-Z]/, (a) => a.toUpperCase())
const toCame = (str) => str.replace(/_([a-zA-Z])/, (_, b) => b.toUpperCase())

// 读取需要修改的源代码内容
var content = `
var a = {
  responce: {
    prompts: '',
    status: 0,
    message: '',
    data: [
      {
        officialPricePrefix: '指导价：',
        seriesName: '奥迪A6',
        officialPrice: '30.80-54.17万',
        seriesId: 98,
        imageUrl:
          'https://p1-dcd.byteimg.com/img/mosaic-legacy/bef30000942d35a1dcc4~tplv-resize:480:0.png',
        price: '30.80-54.17万',
      },
      {
        officialPricePrefix: '指导价：',
        seriesName: '奥迪A6',
        officialPrice: '30.80-54.17万',
        seriesId: 98,
        imageUrl:
          'https://p1-dcd.byteimg.com/img/mosaic-legacy/bef30000942d35a1dcc4~tplv-resize:480:0.png',
        price: '30.80-54.17万',
      },
    ],
  }
}
`
var resultInterface = {}
// 定义一个 babel 插件，拦截并修改为值的类型
let visitor = {
  ObjectProperty: {
    enter(path){
        const value = path.node.value;
        // 处理string
        if(value.type === "StringLiteral"){
          value.value = `DEFINE_STRING`
        }
        // 处理number
        if(value.type === "NumericLiteral"){
          value.type = "StringLiteral"
          value.value="DEFINE_NUMBER"
        }
        // 处理 boolean
        if(value.type === "BooleanLiteral"){
          value.type = "StringLiteral"
          value.value = "DEFINE_BOOLEAN"
        }
    },
    exit(path){
      const node = path.node;
      let key = node.key.name
      key = node.key.name = toCame(key)
      // 值一个对象
      if(node.value && node.value.properties && node.value.properties.length > 0){
        let code = generate(path.node).code
        const Ikey = `I${toUpperCase(toCame(key))}`
        code = `${code}`.replace(`${key}:`, Ikey).replace(/"/g, `'`)
        const res = `export interface ${code}`
        if(!resultInterface[Ikey]){
          resultInterface[Ikey] = res
        }
        node.value.type = "NumericLiteral"
        node.value.value = Ikey
      }
      // 值为数组
      if(node.value && node.value.elements && node.value.elements.length > 0){
        let item = node.value.elements[0]
        const Ikey = `I${toUpperCase(toCame(key))}`
        let itemCode = generate(item).code.replace(`${key}:`, Ikey).replace(/"/g, `'`)
        const res = `export interface ${Ikey} ${itemCode}`
        if(!resultInterface[Ikey]){
          resultInterface[Ikey] = res
        }
        node.value.type = "NumericLiteral"
        node.value.value = `${Ikey}[]`
      }
    }
  }
}

// 通过 plugin 转换源代码 parse 出来的AST 抽象语法树，并且返回结果
let result= babel.transform(content, {
   plugins: [
     { visitor }
   ]
 });

 console.warn(transform(`
 ${Object.values(resultInterface).join("\n")}
 ${result.code.replace('var a = ', '')}`));
