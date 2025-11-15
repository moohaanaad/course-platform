import jwt from 'jsonwebtoken'

export const generateToken =  ({ payload, opption, key = process.env.JWT_KEY }) => {
    return  jwt.sign(payload, key, opption)

}