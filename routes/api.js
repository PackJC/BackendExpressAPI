let express = require('express');
let router = express.Router();
let axios = require('axios');

router.get('/posts', async (req, res) => {
    let posts = [];
    try {
        let tags = req.query.tag.split(',')
        let requests = tags.map((tag) =>
            axios.get("https://api.hatchways.io/assessment/blog/posts?tag="+tag)
        );
        try {
            let result = await Promise.all(requests);
            for(let i = 0; i < result.length; i++){
                posts.push(...result[i].data.posts)
            }
        } catch (err) {
            res.status(500).json({error: String(err)});
        }
        let arrUniq = [...new Map(posts.map(v => [v.id, v])).values()]

        return res.send({posts : arrUniq});
    } catch (err){
        res.status(500).json({ error: "Tags parameter is required" });
    }

});

router.get('/ping', function(req, res) {
    res.status(200).send({ success: true })
});


module.exports = router;
