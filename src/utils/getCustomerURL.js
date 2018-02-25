module.exports = function ({ funnelStep, _id }) {
    const prefix = 'new'
    if (funnelStep === 'lead') return `http://${prefix}.mindsales-crm.com/leads/hot/${_id}`
    if (funnelStep === 'cold') return `http://${prefix}.mindsales-crm.com/leads/cold/${_id}`
    if (funnelStep === 'reject' || funnelStep === 'deal') return `http://${prefix}.mindsales-crm.com/closed/${_id}`
    return `http://${prefix}.mindsales-crm.com/customers/${_id}`
}