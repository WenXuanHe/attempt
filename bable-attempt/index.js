const babel = require('babel-core');
const {ast} = babel.transform(`
  import main from 'runtime:main';
  import * as util from 'runtime:util';
  import {add} from 'runtime:calc';
  import {Nav as Mynav, Banner} from 'runtime:common/component';
  import 'runtime:common/reset';
`);
const traverse = require('babel-traverse').default;
const visitor = require('./visitor');

traverse(ast, visitor.visitor)