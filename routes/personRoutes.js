const express = require('express');
const route = express.Router();
const Person = require('./../model/person');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');
route.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log('Data saved');
        const payload = {
            id: response.id,
            Personusername: response.username
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token :", token);
        res.status(200).json({response: response, token: token});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

route.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        console.log('Person data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
route.get('/profile', async(req, res) =>{
    try{
        const userData = res.user;
        console.log("User data: ", userData);

        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})
route.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;
        const validTypes = ['Chef', 'Waiter', 'Manager']; // ✅ filling
        if (validTypes.includes(workType)) {
            const response = await Person.find({ work: workType });
            console.log("Filtered person data fetched");
            res.status(200).json(response);
        } else {
            res.status(400).json({ error: 'Invalid work type' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
route.put('/:id',async (req, res) => {
    try{
        const personId =req.params.id;
        const updatePersonId = req.body;
        const response = await Person.findByIdAndUpdate(personId, updatePersonId, {
            new : true,
            runValidators : true
        })
        if(!response){
            return res.status(404).json({error : 'Person not foournd'});
        }
        console.log('data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

route.delete('/:id', async (req, res) => {
    try{
        const personId = req.params.id;
        const response = await Person.findByIdAndDelete(personId);
        if(!response){
            return res.status(404).json({error : 'Person data not found'});
        }
        console.log('data deleted');
        res.status(200).json({message : 'Person data deleted sussesfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})
route.post('/login', async(req, res) => {
    try{
       const {username, password} = req.body; 
       const user = await Person.findOne({username: username});
        if(!user || await user.comparePassword(password)){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        const payload = {
            id : user.id,
            username: user.username
        }
        const token = generateToken(payload);
        res.json({token})

    }catch(err){
        console.log(err);
        res.status(500).json({error: "Internel server error"});
    }
})
module.exports = route;
