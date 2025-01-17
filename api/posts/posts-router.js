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

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;

    Posts.findById(id)
        .then(posts => {
            if (!posts) {
                res.status.status(404).json({message: "The post with the specified ID does not exist"})
            } else {
                Posts.findPostComments(id)
                .then(comments => {                
                    res.status(200).json(comments);
                })
                .catch(err => {
                    res.status(500).json({message: "something went wrong"})
                })
            }
        })
        .catch(err => {
            res.status(404).json({message: `The post with the specified ID does not exist`})
        }) 
})

// POST requests

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ message: "must include title and contents"})
    } else {
        Posts.insert({title, contents})
            .then(({ id }) => {
                return Posts.findById(id);
            })
            .then((post) => {
                if (!post) {
                    res.status(400).json({message: "The post with that id doesn't exist"})
                } else {
                    res.status(201).json(post)
                }
            })
            .catch (err => {
                res.status(500).json({message: "Problem creating post"})
            })
    }
})

// router.post('/', (req, res) => {
//     const { title, contents } = req.body;
//     if (!title || !contents) {
//         res.status(400).json({message: "must include title and contents"})
//     } else {
//         Posts.insert({title, contents})
//         .then(({ id }) => {
//                 Posts.findById(id)
//                 .then(posts => {
//                     if (!posts) {
//                         res.status.status(400).json({message: "The post with the specified ID does not exist"})
//                     } else {
//                         res.status(201).json(posts);
//                     }
//                 })
//                 .catch(err => {
//                     res.status(400).json({message: `The post with the specified ID does not exist`})
//                 }) 
//             }
//         )
//         .catch(err => {
//             res.status(500).json({ message: 'oh no. not again.'})
//         })
//     }
// });

// Delete request

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    Posts.findById(id)
    .then(posts => {
        if (!posts) {
            res.status.status(404).json({message: "The post with the specified ID does not exist"})
        } else {
            const savePost = posts;

            Posts.remove(id)
                .then(() => {
                    res.status(200).json(savePost);
                })
        }
    })
    .catch(err => {
        res.status(404).json({message: `The post with the specified ID does not exist`})
    }) 
});

// PUT request

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;

    if (!title || !contents) {
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else {
        Posts.update(id, { title, contents })
            .then(what => {
                Posts.findById(id)
                .then(post => {
                    if (!post) {
                        res.status(404).json({message: "The post with the specified ID does not exist"});
                    } else {
                        res.status(200).json(post);
                    }
                })
        })
        .catch(err => {
        res.status(400).json({message: `The post with the specified ID does not exist`})
    })
}})

module.exports = router;