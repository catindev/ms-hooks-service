const PORT = 5001

const db = require('./db')
const { addLog } = require('./logs')

const Raven = require('raven')
Raven
    .config('https://b857cdba573e45548ed3373be0eaa279:6ea29192567446b38e4fb83cb2d751de@sentry.io/231401')
    .install()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = require('express')()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

app.get('/', (request, response) => response.json({
    name: 'ms-hooks-service'
}))

app.get('/about', (request, response) => response.json({
    name: 'ms-hooks-service',
    version: 2,
    changelog: 'http://telegra.ph/ms-hooks-changelog-02-20'
}))

app.get(
    '/incoming/:customerNumber/:trunkNumber',
    asyncMiddleware(require('./endpoints/incoming'))
)
app.get(
    '/answer/:customerNumber/:managerNumber/:trunkNumber',
    asyncMiddleware(require('./endpoints/answer'))
)

app.post('/call', asyncMiddleware(require('./endpoints/endOfCall')))

app.post('/callback', asyncMiddleware(require('./endpoints/endOfCallback')))

app.all('*', (request, response) => response.status(404).json({
    status: 404,
    message: 'Здесь ничего нет'
}))

app.use((error, request, response, next) => {
    Raven.captureException(error)
    const { message, code = 500 } = error
    response.status(code).json({ status: code, message })
})

app.listen(PORT)

console.log(`Listening on ${PORT}...`)