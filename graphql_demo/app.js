
// const Koa = require('koa')
// const app = new Koa();
// const views = require('koa-views')
// const json = require('koa-json')
// const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')()
// const render = require('koa-swig')
// const co = require('co')
// const path = require('path')
// const index = require('./src/server/router/index')

import Koa from 'koa'
import views from 'koa-views'
import json from 'koa-json'
import onerror from 'koa-onerror'
import koaBodyparser from 'koa-bodyparser'
import render from 'koa-swig'
import co from 'co'
import path from 'path'
import index from './src/server/router/index'

const app = new Koa();
const bodyparser = koaBodyparser();
// error handler
onerror(app);

app.context.render = co.wrap(render({
    root: path.resolve(__dirname + '/views'),
    autoescape: true,
    cache: 'memory',
    ext: 'html',
    writeBody: true
}));

// middlewares
app.use(bodyparser);
app.use(json());

app.use(require('koa-static')(path.resolve(__dirname, './', 'dist')));
// app.use(historyFallback())
app.use(views(path.resolve(__dirname + '/views'), {
  extension: 'html'
}));

app.use(index.routes(), index.allowedMethods());
app.listen(4000);
console.log("server on 5000");
