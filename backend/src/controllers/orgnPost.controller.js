const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants/index')
const CryptoJS = require("crypto-js");



exports.createPost = async (req, res) => {
    const id = CryptoJS.lib.WordArray.random(16).toString();
    try{
        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');        const post  = await db.query('INSERT INTO public."postOrg"(id,"orgId", content, title, slug) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, req.user.id, req.body.content, req.body.title, slug]);
        const orgShortName = await db.query('SELECT name FROM public.organizations where ogrn=$1',[req.user.id]);
        //await db.query('INSERT INTO posts("userId", content, title, slug) VALUES ($1, $2, $3, $4)', [req.user.id, req.body.content, req.body.title, slug]);
        const createdAt = post.rows[0].createdAt.toString();
        const payload = {
            id: post.rows[0].id,
            orgId: req.user.id,
            content: req.body.content,
            title: req.body.title,
            slug: slug,
            image: post.rows[0].image,
            category: post.rows[0].category,
            createdAt: createdAt,
            orgShortName: orgShortName.rows[0],
        }
        
        return res.status(201).json({
            success: true,
            message: 'Пост успешно загружен',
            post : payload,

        })

    }catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message,
        })
    }
};

exports.createProjectEvent = async(req, res) => {
    const id  = CryptoJS.lib.WordArray.random(16).toString();
    try {
        
    } catch (error) {
        
    }
}

exports.updatepost = async(req, res) => {
    try {
        let queryParams = [];
        let queryConditions = [];
        let paramIndex = 1;

        if(req.body.title) {
            queryConditions.push(`title = $${paramIndex}`)
            queryParams.push(req.body.title)
            paramIndex++;
        }
        if(req.body.status) {
            queryConditions.push(`status = $${paramIndex}`)
            queryParams.push(req.body.status);
            paramIndex++;
        }
        if(req.body.content) {
            queryConditions.push(`content = $${paramIndex}`)
            queryParams.push(req.body.content);
            paramIndex++;
        }

        if(req.body.category) {
            queryConditions.push(`category = $${paramIndex}`)
            queryParams.push(req.body.category)
            paramIndex++;
        }

        if(req.body.image) {
            queryConditions.push(`image = $${paramIndex}`)
            queryParams.push(req.body.image);
            paramIndex++;
        }
        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');


        const query = `UPDATE public."postOrg" SET ${queryConditions.join(', ')}
        WHERE id = $${paramIndex} RETURNING *;`;
        queryParams.push(req.params.postId)

        const updatePost = await db.query(query, queryParams);

        console.log(updatePost)
        const id = CryptoJS.lib.WordArray.random(16).toString();


        if(req.body.status === "Опубликован") {
            const post  = await db.query('INSERT INTO posts(id,"userId", content, title, slug, status, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', [id,updatePost.rows[0].orgId, req.body.content, req.body.title, slug, req.body.status, req.body.category]);
        }


        if(paramIndex != 1) {
            await db.query(`UPDATE public."postOrg" SET "updatedAt" = CURRENT_TIMESTAMP(2) WHERE id=$1 RETURNING "updatedAt"`, [req.params.postId]);
   
        } 
        return res.status(200).json({
            updatePost: updatePost.rows[0]
        })




        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            error: error.message,
        })
    }
}


exports.getposts = async(req, res) => {
    try {
    

        console.log(req.query)
        const startIndex = parseInt(req.query.startIndex) || 0; 
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 'ASC' : 'DESC';

        let queryParams = [];
        let queryConditions = [];
        let paramIndex = 1;


        queryConditions.push(`status <> $${paramIndex}`);
        queryParams.push('Опубликован')
        paramIndex++;

        if (req.query.ogrn) {
            queryConditions.push(`"orgId" = $${paramIndex}`);
            queryParams.push(req.query.ogrn);
            paramIndex++;
            
          }
          
          if (req.query.category) {
            queryConditions.push(`category = $${paramIndex}`);
            queryParams.push(req.query.category);
            paramIndex++;
          }
          
          if (req.query.slug) {
            queryConditions.push(`slug = $${paramIndex}`);
            queryParams.push(req.query.slug);
            paramIndex++;
          }
        
          
          if (req.query.postId) {
            queryConditions.push(`id = $${paramIndex}`);
            queryParams.push(req.query.postId);
            paramIndex++;
          }
          
          if (req.query.searchTerm) {
            queryConditions.push(`(title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
            queryParams.push(`%${req.query.searchTerm}%`);
            paramIndex++;
          }



          const query = `
            SELECT * FROM public."postOrg"  ${paramIndex !== 1 ? `WHERE ${queryConditions.join(' AND ')}` :
               '' } ORDER BY "updatedAt" ${sortDirection} OFFSET $${paramIndex} LIMIT $${paramIndex + 1}`;

          
            console.log(`${query}  query query query `)
          queryParams.push(startIndex, limit);

          
          
          const posts = await db.query(query, queryParams);
          
          const totalPosts = await db.query(`SELECT COUNT(*) FROM public."postOrg" WHERE status <> 'Опубликован'`);
          
          const now = new Date();
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          
          const lastMonthPosts = await db.query(`SELECT COUNT(*) FROM public."postOrg" WHERE "updatedAt" >= $1 AND status <> 'Опубликован'`, [oneMonthAgo]);
          
          return res.status(200).json({
                posts: posts.rows,
                countAllPosts: totalPosts.rows[0],
                countLastMonthPosts: lastMonthPosts.rows[0],
            });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error:  error.message,
        })
    }
}