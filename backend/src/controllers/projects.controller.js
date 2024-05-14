const db = require('../db')
const { hash } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants/index')
const CryptoJS = require("crypto-js");


exports.create = async (req, res) => {

    const id = CryptoJS.lib.WordArray.random(16).toString();
    try{
        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');        const post  = await db.query('INSERT INTO posts(id, "userId", content, title, slug) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [id, req.user.id, req.body.content, req.body.title, slug]);
        const createdAt = post.rows[0].createdAt.toString();
        const payload = {
            id: post.rows[0].id,
            userId: req.user.id,
            content: req.body.content,
            title: req.body.title,
            slug: slug,
            image: post.rows[0].image,
            category: post.rows[0].category,
            createdAt: createdAt,
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


exports.getprojects = async (req, res) => {
    try {
        console.log(req.query)
        const startIndex = parseInt(req.query.startIndex) || 0; 
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 'ASC' : 'DESC';

        let queryParams = [];
        let queryConditions = [];
        let paramIndex = 1;

        if (req.query.userId) {
            queryConditions.push(`organization_id = $${paramIndex}`);
            queryParams.push(req.query.userId);
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
          if(req.query.status) {
            queryConditions.push(`status = $${paramIndex}`);
            queryParams.push(req.query.status)
            paramIndex++;
          }
          
          if (req.query.projectId) {
            queryConditions.push(`id = $${paramIndex}`);
            queryParams.push(req.query.postId);
            paramIndex++;
          }
          
          if (req.query.searchTerm) {
            queryConditions.push(`(title ILIKE $${paramIndex} OR mission ILIKE $${paramIndex})`);
            queryParams.push(`%${req.query.searchTerm}%`);
            paramIndex++;
          }

          const query = `
            SELECT * FROM public.projects  ${paramIndex !== 1 ? ` WHERE ${queryConditions.join(' AND ')}` :
               ' ' } ORDER BY "cratedAt" ${sortDirection} OFFSET $${paramIndex} LIMIT $${paramIndex + 1}`;

          
               console.log(query)
          queryParams.push(startIndex, limit);

          
          
          const projects = await db.query(query, queryParams);
          
          const totalPosts = await db.query('SELECT COUNT(*) FROM public.projects');
          
          const now = new Date();
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          
          const lastMonthPosts = await db.query('SELECT COUNT(*) FROM public.projects WHERE "cratedAt" >= $1', [oneMonthAgo]);
          
          
          return res.status(200).json({
                projects: projects.rows,
                countAllProjetcs: totalPosts.rows[0],
                countLastMonthProjects: lastMonthPosts.rows[0],
            });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error:  error.message,
        })
    }
}

exports.deletepost = async(req, res) => {
    try{
        await db.query('DELETE FROM posts WHERE id = $1;', [req.params.postId])
        return res.status(200).json('Пост удален')
    }catch(error){
        return res.status(400).json({
            error: error.message
        })
    }
        

}

exports.updatepost = async (req, res) => {

    try{

       

        let queryParams = [];
        let queryConditions = [];
        let paramIndex = 1;

        if(req.body.title){
        queryConditions.push(`title = $${paramIndex}`)
        queryParams.push(req.body.title);
        paramIndex++;
        }


        if(req.body.content) {
            queryConditions.push(`content = $${paramIndex}`)
            queryParams.push(req.body.content);
            paramIndex++;
        }
        if(req.body.status) {
            queryConditions.push(`status = $${paramIndex}`)
            queryParams.push(req.body.status);
            paramIndex++;
        }

        if(req.body.category) {
            queryConditions.push(`category = $${paramIndex}`)
            queryParams.push(req.body.category);
            paramIndex++;
        }

        if(req.body.image) {
            queryConditions.push(`image = $${paramIndex}`)
            queryParams.push(req.body.image);
            paramIndex++;
        }

        let query;
        if(req.user.isAdmin){
            query = ` UPDATE public.posts SET ${queryConditions.join(', ')}
        WHERE id = $${paramIndex} RETURNING *;
        `
        }
 
      

        console.log(query)
        queryParams.push(req.params.postId)
        const updatePost = await db.query(query, queryParams);
        if(paramIndex != 1){
            const t = await db.query('UPDATE public.posts SET "updatedAt" = CURRENT_TIMESTAMP(2) WHERE id=$1 RETURNING "updatedAt"', [req.params.postId])
        }
        return res.status(200).json({
            updatePost : updatePost.rows[0]
        })
     }catch (error) {
        return res.status(500).json({
            error: error.message,
        })
    }
}






