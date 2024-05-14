const { body, check ,param } = require('express-validator')
const db = require('../db')
const { hashSync } = require('bcryptjs');


const id = param('userId').custom(async (value, { req }) => {
    if(value !== req.user.id) {
        throw new Error('Wrong!!!')
    }
})


const password = check('password')
    .isLength({min: 6})
    .withMessage('Длина пороля должна быть не менее, чем 6 символов.')
    .custom(async (value, { req }) => {



            value = hashSync(value, 10);
            if(req.user.isAdmin){
                await db.query('UPDATE public."usersLogin" SET password=$1 WHERE id = $2', [value, req.body.ogrn])
                const  organization =  await db.query('SELECT * FROM public.organizations WHERE id = $1', [req.params.organizationId])
                //console.log(req.params.organizationId)
                //console.log(organization.rows[0])
                //console.log(req.body.ogrn)
                req.persnId = organization.rows[0]
                //console.log(`PersID: ${orgn.rows[0].id_persn}`)

            }
            else {
                if(req.user.isPersnOrg) {
                    console.log("noooneee")

                await db.query('UPDATE public."personOrgnz" SET password=$1 WHERE id = $2', [value, req.body.ogrn])}

                else{
                    console.log("noooneee2222")

                    await db.query('UPDATE users SET password=$1 WHERE id =$2', [value, req.params.userId])
                }
                await db.query('UPDATE public."usersLogin" SET password=$1 WHERE id = $2', [value, req.user.id])
            }
            }
    );





module.exports = {
    usernameUpdateValidation: [id, password],
    organizationPasswordUpdate: [password]
}

    