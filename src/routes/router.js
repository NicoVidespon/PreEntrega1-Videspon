import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { privateKey } from '../utils/authToken.js'

export class RouterClass {
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }

    init() {}

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.error(error)
                params[1].status(500).send(error)
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.send({ status: 'success', payload })
        res.sendServerError = error => res.status(500).send({ status: 'error', error })
        res.sendUserError = error => res.status(400).send({ status: 'error', error })
        next()
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies[0] === 'PUBLIC') return next()

        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).send({ status: 'error', error: 'Unauthorized' })
        }

        const token = authHeader.split(' ')[1]
        try {
            const user = jwt.verify(token, privateKey)
            if (!policies.includes(user.role.toUpperCase())) {
                return res.status(403).send({ status: 'error', error: 'No Permissions' })
            }
            req.user = user
            next()
        } catch (error) {
            return res.status(401).send({ status: 'error', error: 'Invalid Token' })
        }
    }

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, ...this.applyCallbacks(callbacks))
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, ...this.applyCallbacks(callbacks))
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, ...this.applyCallbacks(callbacks))
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, ...this.applyCallbacks(callbacks))
    }
}
