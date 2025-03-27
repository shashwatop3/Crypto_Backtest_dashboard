import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
export const runtime = 'edge'
import { HTTPException } from 'hono/http-exception'

const app = new Hono().basePath('/api')

app.use('*', clerkMiddleware())

app.onError((err, c) => {
    if(err instanceof HTTPException){
        err.getResponse();
    }
    return c.json({error:"Internal error"}, 500)
})// so that return type of data and error are same.

const routes = app



export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes