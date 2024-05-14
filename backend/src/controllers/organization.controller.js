const db = require('../db')
const { hashSync } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants/index')
const CryptoJS = require("crypto-js");



exports.updatePersonOrganization = async (req, res) => {

        try{
            const  userPass   = await db.query('SELECT * FROM public."usersLogin" WHERE id = $1', [req.body.ogrn])

            const persn  = await db.query('SELECT * FROM public.organizations WHERE id = $1', [req.params.organizationId])
            console.log(userPass)
           console.log(persn)

           await db.query('UPDATE "personOrgnz" SET password=$1 WHERE id = $2', [userPass.rows[0].password, persn.rows[0].id_persn])

    
           

    return res.status(200).json({
        success: true,
        message: 'Изменения выполнены успешно'
        
  
    })
   }catch(error) {
    console.log(error.message)
    return res.status(400).json({
        error: error.message
    })
}
}

exports.getOrganizations = async (req, res) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) ||9;
        const sortDirection = req.query.order === 'asc' ? 'ASC' : 'DESC';

        let queryParams = [];
        let queryConditions = [];
        let paramIndex = 1;

        
        if(req.query.name) {
            queryConditions.push(`name= $${paramIndex}`)
            queryParams.push(req.query.name)
            paramIndex++;
        }

        if(req.query.region) {
            queryConditions.push(`region= $${paramIndex}`)
            queryParams.push(req.query.region)
            paramIndex++;
        }
        if(req.query.organizationId) {
            queryConditions.push(`o.id = $${paramIndex}`);
            queryParams.push(req.query.organizationId);
            paramIndex++;
        }

        if(req.query.searchTerm) {
            queryConditions.push(`name ILIKE $${paramIndex}`)
            queryParams.push(req.query.searchTerm)
            paramIndex++;
        }

        const query = `SELECT o.*, p.last_name, p.first_name, p.otchestvo, p.phone, p.email FROM public.organizations o INNER JOIN public."personOrgnz" p ON o.id_persn = p.id
         ${paramIndex !== 1 ? ` WHERE ${queryConditions.join(' AND ')}` : ' '} ORDER BY "createdAt" ${sortDirection} OFFSET $${paramIndex} LIMIT $${paramIndex + 1}`;

         queryParams.push(startIndex, limit);

         const organizations = await db.query(query, queryParams);
         const totalOrganizations = await db.query('SELECT COUNT(*) FROM organizations');

         const now = new Date();
         const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
         
         const lastMonthOrganizations = await db.query('SELECT COUNT(*) FROM public.organizations WHERE "updatedAt" >= $1', [oneMonthAgo]);
         
         return res.status(200).json({
            organizations: organizations.rows,
            countAllOrganizations: totalOrganizations.rows[0],
            lastMonthOrganizations: lastMonthOrganizations.rows[0],
            
         });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message,
        })
    }
}

exports.changePasswordOrg = async (req, res) => {
    try {
        return res.status(200).json({
        success: true,
     })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message,
        })
    }
}

exports.registerOrganization = async (req, res) => {
    const id = CryptoJS.lib.WordArray.random(16).toString();
    const {name, region, addres, ogrn, mission, form} = req.body
    try {
        const orgnz = await db.query('INSERT INTO public.organizations(id, name, region, addres, ogrn, mission, id_persn, form) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [id, name,region, addres, ogrn, mission, req.persOrg.id, form]);
        await db.query('INSERT INTO public."usersLogin"(id, email,  "isAdmin", "isPersnOrg", password) VALUES ($1, $2, $3, $4, $5)',[ogrn, req.persOrg.email, false, true, req.persOrg.password])
        return res.status(201).json({
            success: true,
            message: 'Регистрация прошла успешно',
            organization: orgnz.rows[0],
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message,
        })
    }
}



exports.deleteOrganizaton = async(req, res) => {
    try{
        await db.query('DELETE FROM public.organizations WHERE id = $1', [req.params.organizationId])
        return res.status(200).json('Аккаун удален')
    }catch(error){
        return res.status(400).json({
            error: error.message
        })
        
    }

}


