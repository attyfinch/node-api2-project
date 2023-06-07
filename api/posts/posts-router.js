// implement your posts router here
// this is where I put all the requests once I get it going.

const express = require('express');
const router =  express.Router();
const Posts = require('./posts-model')

// GET requests
router.get('/', (req, res) => {
    Posts.find()
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error retrieving the posts' });
      });
  });

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
        .then(posts => {
            if (!posts) {
                res.status.status(404).json({message: "The post with the specified ID does not exist"})
            } else {
                res.status(200).json(posts);
            }
        })
        .catch(err => {
            res.status(404).json({message: `The post with the specified ID does not exist`})
        }) 
});

// POST requests

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({message: "must include title and contents"})
    } else {
        Posts.insert({title, contents})
        .then(({ id }) => {
                Posts.findById(id)
                .then(posts => {
                    if (!posts) {
                        res.status.status(400).json({message: "The post with the specified ID does not exist"})
                    } else {
                        res.status(201).json(posts);
                    }
                })
                .catch(err => {
                    res.status(400).json({message: `The post with the specified ID does not exist`})
                }) 
            }
        )
        .catch(err => {
            res.status(500).json({ message: 'oh no. not again.'})
        })
    }
})




module.exports = router;