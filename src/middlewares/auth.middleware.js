
export default function authentication(req, res, next) {
    console.log(req.session.email, req.session.admin)
    if(req.session.user.email !== 'f@gmail.com' || !req.session.user.isAdmin ) {
        return res.send('error de autenticación ')
    }
    next()
}
