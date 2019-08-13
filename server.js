const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

// Get All Acounts
server.get('/', (req,res)=>{
    db('accounts')
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch( err => {
            res.status(400).json({message: 'oh no, an error occured'})
        })
})

// Get One Account
server.get('/:id', (req,res)=>{
    db('accounts').where({id: req.params.id})
    .first()
        .then(account => {
            res.status(200).json(account)
        })
        .catch( err => {
            res.status(400).json({message: 'oh no, an error occured'})
        })
})

server.post('/', (req,res)=>{
    const account = req.body
    !req.body.name || !req.body.budget ? res.status(400).json({message: "Must have a name and a budget!"}):
    db('accounts').insert(account)
        .then( account => {
            res.status(200).json(account)
        })
        .catch( err => {
            res.status(500).json({message: "Not Found"})
        })
})

server.put('/:id', (req,res)=> {
    const account = req.body
    !account.name || !account.budget ? res.status(400).json({message: "Must have a name and a budget!"}):
    db('accounts').where('id', '=', req.params.id).update({name: account.name, budget: account.budget})
        .then( count => {
            if(count > 0){
                res.status(200).json(count)
            } else {
                res.status(404).json({message: 'Not Found!'})
            }
        })
        .catch( err => {
            res.status(400).json({message: "Uh oh! An error happened!"})
        })
})

server.delete('/:id', (req,res) => {
    db('accounts').where('id', '=', req.params.id).del()
    .then( count => {
        if(count > 0){
            res.status(200).json(count)
        } else {
            res.status(404).json({message: 'Not Found!'})
        }
    })
    .catch( err => {
        res.status(400).json({message: "Uh oh! An error happened!"})
    })
})

module.exports = server;