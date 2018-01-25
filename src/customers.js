const toObjectId = require('mongoose').Types.ObjectId
const { Account, Trunk, User, Customer, Call } = require('./schema')
const CustomError = require('./utils/error')
const namer = require('./utils/namer')
const formatNumber = require('./utils/formatNumber')
const { addLog } = require('./logs')
const sendPush = require('./utils/sendPush')
const { promisify } = require('util')
const sendPushAsync = promisify(sendPush)

async function incomingCustomer({ customerNumber, trunkNumber }) {
    const trunk = await Trunk.findOne({
        phone: formatNumber(trunkNumber, false),
        active: true
    })
        .populate('account')
        .exec()

    if (!trunk || trunk === null)
        throw new CustomError(`Транк ${trunkNumber} не зарегистрирован либо отключен`, 400)

    const existingCustomer = await Customer.findOne({
        account: trunk.account._id,
        phones: formatNumber(customerNumber, false)
    })

    if (existingCustomer) return existingCustomer

    const phone = formatNumber(customerNumber)
    const newCustomer = new Customer({
        account: trunk.account._id,
        phones: [phone],
        trunk: trunk._id
    })

    return await newCustomer.save()
}

async function answerToCustomer({ customerNumber, managerNumber }) {
    const customer = await Customer.findOne({ account, phones: formatNumber(customerNumber, false) })
    if (!customer || customer === null)
        throw new CustomError(`Не могу назначить менеджера — клиент ${customerNumber} не найден`, 400)

    const user = await User.findOne({ account: customer.account, phones: formatNumber(managerNumber, false) })
    if (!user || user === null)
        throw new CustomError(`Не могу назначить менеджера — менеджер ${managerNumber} не найден`, 400)

    await Customer.update({ _id: customer._id }, { user: user._id })

    const pushResp = await sendPushAsync({
        app_id: "76760ad6-f2f4-4742-8baf-ff9c8f6bc3f6",
        headings: { "en": "Новый клиент", "ru": "Новый клиент" },
        contents: { "en": "Заполните профиль", "ru": "Заполните профиль" },
        url: 'http://new.mindsales-crm.com/leads/hot/' + customer._id,
        filters: [
            { "field": "tag", "key": "userId", "relation": "=", "value": user._id },
            { "field": "tag", "key": "device", "relation": "=", "value": "desktop" }
        ]
    });

    addLog({
        type: 'push', what: 'пуш на заполнение профиля',
        payload: {
            customerNumber, managerNumber,
            pushResponse: pushResp
        }
    })
}

module.exports = { incomingCustomer, answerToCustomer }