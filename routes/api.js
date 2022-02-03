let express = require('express');
let router = express.Router();
let axios = require('axios');

/*
GET POSTS
 */
router.get('/posts', async (req, res) => {
    let posts = [];

    try {
        //Split tags into array
        let tags = req.query.tag.split(',')
        let sortBy = req.query.sortBy
        //sortBy defaults to ascending if undefined
        if(sortBy === undefined){
            sortBy = 'asc'
        }
        let direction = req.query.direction
        //Iterate through tag array for axios API GET
        let requests = tags.map((tag) =>
            axios.get("https://api.hatchways.io/assessment/blog/posts?tag="+tag)
        );
        try {
            //API requests
            let result = await Promise.all(requests);
            //Add all API requests to array
            for(let i = 0; i < result.length; i++){
                //Push each requests' posts to main collection
                posts.push(...result[i].data.posts)
            }
        } catch (err) {
            res.status(500).json({error: String(err)});
        }
        try {
            //Remove duplicates
            let arrUniq = [...new Map(posts.map(v => [v.id, v])).values()]

            if (direction === 'desc') {
                //Sort in Descending order [sortBy]
                arrUniq.sort((x, y) => y[sortBy] - x[sortBy]);
            } else {
                //Sort in Ascending order on [sortBy]
                arrUniq.sort((x, y) => x[sortBy] - y[sortBy]);
            }
            return res.send({posts: arrUniq});
        } catch (err) {
            res.status(500).json({ error: "sortBy or direction has an invalid value" });

        }
    } catch (err){
        res.status(500).json({ error: "Tags parameter is required" });
    }
});

/*
GET PING
 */
router.get('/ping', function(req, res) {
    res.status(200).send({ success: true })
});

module.exports = router;