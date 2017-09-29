import koaRouter from 'koa-router'
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa'
import schema from '../data/schema'

let router = koaRouter();
router.get('/', async (ctx, next) => {
    await ctx.render('index', {});
});

router.post('/graphql', graphqlKoa({ schema: schema }));
router.get('/graphql', graphqlKoa({schema: schema}));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));


module.exports = router
