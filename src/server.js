import Koa from 'koa'
import serve from 'koa-static'
import send from 'koa-send'
import path from 'path'

const app = new Koa()
const port = process.env.PORT || 3000

// Serve static files
app.use(serve('public'))

// Serve pages
app.use(async(ctx) => {
    await send(ctx, 'public/index.html')
})

// Serve
app.listen(port)
console.log("Started server on port " + port)
