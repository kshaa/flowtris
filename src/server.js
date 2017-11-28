import Koa from 'koa'
import serve from 'koa-static'
import send from 'koa-send'

const port = process.env.PORT || 3000
const app = new Koa()

// Static files
app.use(serve('public'))

// Pages
app.use(async(ctx) => {
    await send(ctx, 'public/index.html')
})

// Init server
const server = app.listen(port)

