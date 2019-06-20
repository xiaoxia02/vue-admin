const  isProMode = Object.is(process.env.NODE_ENV,'production')

module.exports={
    baseUrl:isProMode ? '/api':'/api'

};