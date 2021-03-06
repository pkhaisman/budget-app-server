const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''

    let bearerToken
    // check if authToken missing
    if (!authToken.toLowerCase().startsWith('bearer')) {
        return res.status(401).json({ error: `Missing bearer token`})
    // if authToken present then get the hash
    } else {
        bearerToken = authToken.slice(7, authToken.length)
    }

    (bearerToken)

    // check if jwt secrets match
    try {
        const payload = AuthService.verifyJwt(bearerToken)
        AuthService.getUserWithUsername(
            req.app.get('db'),
            payload.sub
        )
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: `Unauthorized request` })
                }
                
                req.user = user
                next()
            })
            .catch(error => {
                console.error(error)
                next(error)
            })
    } catch (error) {
        // DEPLOY 401 ERROR CALLED HERE
        res.status(401).json({ error: `Unauthorized request` })
    }
}

module.exports = {
    requireAuth
}