const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId, Mixed } = Schema.Types
const { generate } = require('./utils/namer')
const formatNumber = require('./utils/formatNumber')

const Log = mongoose.model('Log', new Schema({
    type: String,
    who: { type: ObjectId, ref: 'User' },
    when: { type: Date, default: new Date() },
    what: String,
    payload: Mixed
}))

const Account = mongoose.model('Account', new Schema({
    name: String,
    maxWaitingTime: { type: Number, default: 12000 },
    maxConversationTime: { type: Number, default: 120000 },
    funnelSteps: [String],
    noTargetReasons: { type: [String], default: ['Другое', 'Ошиблись номером'] },
    targetQuestion: { type: String, default: 'Клиент интересовался услугами вашей компании?' },
    author: { type: ObjectId, ref: 'Admin' },
    created: { type: Date, default: Date.now() }
}))

const User = mongoose.model('User', new Schema({
    account: { type: ObjectId, ref: 'Account' },
    created: { type: Date, default: Date.now() },
    access: { type: String, enum: ['boss', 'manager'], default: 'manager' },
    name: String,
    phones: [String],
    email: String,
    password: String
}))

const Trunk = mongoose.model('Trunk', new Schema({
    account: { type: ObjectId, ref: 'Account' },
    phone: String,
    name: String,
    active: { type: Boolean, default: false },
}))

const Contact = mongoose.model('Contact', new Schema({
    account: { type: ObjectId, ref: 'Account' },
    customer: { type: ObjectId, ref: 'Customer' },
    name: String,
    phone: String
}))

const customerSchema = new Schema({
    account: { type: ObjectId, ref: 'Account' },
    trunk: { type: ObjectId, ref: 'Trunk' },
    user: { type: ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now() },
    lastUpdate: { type: Date, default: new Date() },
    lastActivity: String,
    name: String,
    phones: [String],
    notes: String,
    funnelStep: { type: String, default: 'lead' },
    nonTargetedReason: String,
    fromWidget: { type: Boolean, default: false },
    contacts: [{ type: ObjectId, ref: 'Contact' }],
    breadcrumbs: [{ type: ObjectId, ref: 'Breadcrumb' }]
})
customerSchema.pre('save', function (next) {
    if (!this.name) this.name = generate()
    this.phones = this.phones.map(phone => formatNumber(phone))
    next()
})
const Customer = mongoose.model('Customer', customerSchema)

const Call = mongoose.model('Call', new Schema({
    account: { type: ObjectId, ref: 'Account' },
    customer: { type: ObjectId, ref: 'Customer' },
    trunk: { type: ObjectId, ref: 'Trunk' },
    answeredBy: { type: ObjectId, ref: 'User' },
    contact: { type: ObjectId, ref: 'Contact' },
    user: { type: ObjectId, ref: 'User' },
    fromWidget: { type: Boolean, default: false },
    date: { type: Date, default: new Date() },
    record: String,
    duration: {
        waiting: Number,
        conversation: Number
    },
    isCallback: Boolean
}))

const Breadcrumb = mongoose.model('Breadcrumb', new Schema({
    account: { type: ObjectId, ref: 'Account' },
    customer: { type: ObjectId, ref: 'Customer' },
    date: { type: Date, default: Date.now() },
    type: {
        type: String,
        enum: [
            'created', // 🐣
            'assigned', // 👥
            'call', // ⬅
            'callback', // ➡
            'note', // 💬
            'deal', // 💰
            'reject', // 🚽
            'reopen' // 🔄
        ]
    },
    comment: String,

    /* Спецполя */

    // для assigned 
    // пустое когда created по звонку с АТС и на пропущенный звонок
    user: { type: ObjectId, ref: 'User' },

    call: { type: ObjectId, ref: 'Call' }, // для call
    reason: String, // для reject
    amount: Number, // для deal
}, { strict: false }))


module.exports = {
    Log,
    Account,
    User,
    Trunk,
    Call,
    Contact,
    Customer,
    Breadcrumb
}