const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants/index')
const CryptoJS = require("crypto-js");


exports.getPersonsOrganization = async (req, res) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) ||9;
        const sortDirection = req.query.order === 'asc' ? 'ASC' : 'DESC';
        const { rows } = await db.query('SELECT p.id, p.last_name, p.first_name, p.otchestvo, p.phone, p.email, p."createdAt",o.name FROM public."personOrgnz" p INNER JOIN public.organizations o ON p.id = o.id_persn')

        let queryParams = [];
        let queryConditions = [];
        let paramIndex = 1;

        
        if(req.query.name) {
            queryConditions.push(`o.name= $${paramIndex}`)
            queryParams.push(req.query.name)
            paramIndex++;
        }
        if(req.query.searchTerm) {
            queryConditions.push(`o.name ILIKE $${paramIndex}`)
            queryParams.push(req.query.searchTerm)
            paramIndex++;
        }

        const query = `SELECT p.id, p.last_name, p.first_name, p.otchestvo, p.phone, p.email, o.name, o.img FROM public."personOrgnz" p INNER JOIN public.organizations o ON p.id = o.id_persn 
         ${paramIndex !== 1 ? ` WHERE ${queryConditions.join(' AND ')}` : ' '} ORDER BY "createdAt" ${sortDirection} OFFSET $${paramIndex} LIMIT $${paramIndex + 1}`;

         queryParams.push(startIndex, limit);

         const persons = await db.query(query, queryParams);
         const totalPersonsOrg = await db.query('SELECT COUNT(*) FROM personOrgnz');

         return res.status(200).json({
            personsOrgnz: persons.rows,
            countAllPersOrg: totalPersonsOrg
            
         });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message,
        })
    }
}

exports.registerPersonOrganization = async (req, res,next) => {
    const {last_name, first_name, otchestvo, phone, email, password} = req.body
    const id = CryptoJS.lib.WordArray.random(16).toString();
    try {
        const hashedPassword = await hash(password, 10)
        const persOrg = await db.query('INSERT INTO public."personOrgnz"(id, last_name, first_name, otchestvo, phone, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [id, last_name, first_name, otchestvo, phone, email, hashedPassword])
        req.persOrg = persOrg.rows[0]
        next();
        } 
         catch (error) {
        console.log(`${error.message} error on registerPersonOrg class persnOrg str 66`)
        return res.status(500).json({
            error: error.message,
        })
    }
}


exports.login = async (req, res) => {
    const user = req.user;
    
    const payload = {
        id: user.rows[0].id,
        email: user.rows[0].email
    
    }

    try{ 
        const token = await sign(payload, SECRET)

        return res.status(200).cookie('token', token, {
            httpOnly: true
        }).json({
            success: true,
            message: 'Вход выполнен успешно',
            persnOrg: payload
            
        })

    }catch(error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message,
            
        })
    }
}




exports.logout = async (req, res) => {
    try{
        return res.status(200).clearCookie('token', {
        }).json({
            success: true,
            message: 'Вывход выполнен успешно.'
        })
    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message,
        })

    }
}