import express from 'express'
import State from '../models/State.js'
import City from '../models/City.js'

const router = express.Router()

router.get('/all-state', async (req,res)=>{
    try {
        const data = await State.find({});
        res.status(200).json({states: data})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "something went wrong"})
    }
})

router.get("/city-by-id/:id", async (req,res) =>{
    try {
        const data = await City.find({stateId: req.params.id})
        res.status(200).json({city: data})
    } catch (error) {
        res.status(500).json({msg: "something went wrong"})
    }
})

export default router;