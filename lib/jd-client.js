const util = require('./utils')
const request = require('./network')

function JDClient(options) {
    if(!(this instanceof JDClient)) {
        return new JDClient(options)
    }
    options = options || {}

    if (!options.appKey || !options.secretKey) {
        throw new Error('appKey and secretKey are necessary!')
    }

    this.appKey = options.appKey
    this.secretKey = options.secretKey
    this.endpoint = options.endpoint || 'https://api.jd.com/routerjson'
}

JDClient.prototype.request = function(params) {
    const { method, ...rest } = params
    const args = {
        timestamp: this.timestamp(),
        v: '1.0',
        sign_method: 'md5',
        format: 'json',
        app_key: this.appKey,
        '360buy_param_json' : JSON.stringify(rest),
        method,
    }

    args.sign = this.sign(args)

    return new Promise((resolve, reject) => {
        const err = util.checkRequired(params, 'method')
        if(err) {
            reject(err)
        }
        request.post(this.endpoint, args).then(res => resolve(res)).catch(err => reject(err))
    })
}

JDClient.prototype.execute = function(apiname, params) {
    params.method = apiname

    return this.request(params).then((res) => {
        const field = `${apiname.replace(/\./g, '_')}_responce`
        const resp = res[field];
        const resultKey = apiname.substring(apiname.lastIndexOf('.')+1)+'Result';
        resp.result = JSON.parse(resp[resultKey]|| null);
        return resp
    })
}

JDClient.prototype.sign = function(params) {
    var sorted = Object.keys(params).sort()
    var basestring = this.secretKey
    for (var i = 0, l = sorted.length; i < l; i++) {
        var k = sorted[i]
        basestring += k + params[k]
    }
    // console.log(params)
    basestring += this.secretKey
    // console.log('basestring ==>', basestring)
    return util.md5(basestring).toUpperCase()
}

JDClient.prototype.timestamp = function(d, options) {
    d = d || new Date()
    if (!(d instanceof Date)) {
        d = new Date(d)
    }

    var dateSep = '-'
    var timeSep = ':'
    if (options) {
        if (options.dateSep) {
            dateSep = options.dateSep
        }
        if (options.timeSep) {
            timeSep = options.timeSep
        }
    }
    var date = d.getDate()
    if (date < 10) {
        date = '0' + date
    }
    var month = d.getMonth() + 1
    if (month < 10) {
        month = '0' + month
    }
    var hours = d.getHours()
    if (hours < 10) {
        hours = '0' + hours
    }
    var mintues = d.getMinutes()
    if (mintues < 10) {
        mintues = '0' + mintues
    }
    var seconds = d.getSeconds()
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    return d.getFullYear() + dateSep + month + dateSep + date + ' ' +
        hours + timeSep + mintues + timeSep + seconds
}

module.exports = JDClient
