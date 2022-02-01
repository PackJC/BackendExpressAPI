var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/posts/:tag?', function(req, res, next) {
        axios.get("https://api.hatchways.io/assessment/blog/posts?"+req.params.tag)
            .then((response)=>{
                let postsArray = [];
                response.data.posts.map((posts)=>{
                    postsArray.push(posts);
                });
                res.render("apiPosts", {
                    posts: postsArray
                });
            })
            .catch((err) => {
                console.log(err)
            });


});



module.exports = router;
