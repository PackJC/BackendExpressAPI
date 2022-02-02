var express = require('express');
var router = express.Router();
const axios = require('axios');

router.get('/posts', async (req, res) => {
    let posts;
    try {
        var tags = req.query.tag.split(',')
        const requests = tags.map((tag) =>
            axios.get("https://api.hatchways.io/assessment/blog/posts?tag=" + tag)
        );
        try {
            const result = await Promise.all(requests);
            result.map((item) => {
                posts = item.data.posts;
            });
        } catch (err) {
            res.status(500).json({error: String(err)});
        }
        return res.send({posts : posts});
    } catch (err){
        res.status(500).json({ error: "Tags parameter is required" });
    }

});

router.get('/ping', function(req, res, next) {
    res.status(200).send({ success: true })
});


module.exports = router;
