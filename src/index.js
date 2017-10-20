const PORT = 5001

const db = require('./db')

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

app.post('/call', (request, response) => {
    const required = [
        'clientNumber',
        'trunkNumber',
        'redirectNumber',
        'record',
        'waitingDuration',
        'conversationDuration',
        'crmCallID'
    ]
    
    const missing = Object
      .keys(request.body)
      .filter( key => required.indexOf(key) !== -1 )

    response.json(missing)  
})

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

console.log(`Listening on ${ PORT }...`)