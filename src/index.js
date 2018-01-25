const PORT = 5001

const db = require('./db')

const sendPush = require('./utils/sendPush')
const { promisify } = require('util')
const sendPushAsync = promisify(sendPush)
const { incomingCustomer } = require('./customers')
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

app.get('/', (request, response) => response.json({
    name: 'ms-hooks-service',
    version: 1
}))

app.post('/call', require('./call-route'))

app.post('/callback', require('./call-route'))

app.get('/github', (request, response) => {
    console.log(request.query)
    response.json({ status: 200 })
})

app.get('/incoming/:customerNumber/:trunkNumber', require('./incomingRoute'))

app.get('/answer/:customerNumber/:managerNumber/:trunkNumber', require('./answerRoute'))

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