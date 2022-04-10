const router = require("express").Router();
const verify = require('./verifyToken');
const { doctorAppointmentValidation, patientAppointmentValidation } = require('../validation');
const User = require('../model/User');
const JsonSearch = require('search-array').default

router.get('/get', verify, (req, res) => {
    let userstuffs = User.findOne({ _id: req.user });
    res.send(userstuffs.appointments);
});

router.get('/search', verify, (req, res) => {
    let userstuffs = User.findOne({ _id: req.user });

    let searchTerm = req.body.search;

    const searcher = new JsonSearch(userstuffs.appointments);
    let objex = searcher.query(searchTerm);
    if(objex === []) {
        res.send('Appointment not found, try to generalize your search term');
    } else {
        res.send(objex);
    }
});

router.post('/make', verify, async(req, res) => {
    let user = User.findOne({ _id: req.user });

    async function createRequest(aUserK) {
        if(user.isVerifiedDoctor) {
            let findIt = user.patients.find(({ userKey }) => userKey === aUserK);
            let aUser = User.findOne({ userKey: aUserK });
            let findItDoctor = aUser.doctors.find(({ userKey }) => userKey === user.userKey);
            if(findIt != undefined && findItDoctor != undefined) {
                let notif = {
                    type: 'Appointment request',
                    title: req.body.appointment.title,
                    from: "Dr. " + user.lastName,
                    read: false,
                    date: req.body.appointment.date,
                    location: req.body.appointment.location
                }
                aUser.notifications.push(notif);
                let savedUser = await aUser.save();
            } else {
                res.status(401).send('You have not added this patient or the patient has not added you');
            }
        } else {
            let findTheDoctor = user.patients.find(({ userKey }) => userKey === aUserK);
            let aUser = User.findOne({ userKey: aUserK });
            let findStuffs = aUser.doctors.find(({ userKey }) => userKey === user.userKey);
            if(findTheDoctor != undefined && findStuffs != undefined) {
                let notif = {
                    type: 'Appointment Request',
                    title: req.body.appointment.title,
                    from: user.firstName + user.lastName,
                    read: false,
                    date: req.body.appointment.date,
                    location: req.body.appointment.location
                }
                aUser.notifications.push(notif);
                let savedUser = await aUser.save();
            } else {
                res.status(401).send('You have not added this doctor or the doctor has not added you');
            }
        }
    }
    
    if(user.isVerifiedDoctor) {
        // Validate Data
        const { error } = doctorAppointmentValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        for(var i in req.body.appointment.patients) {
            createRequest(req.body.appointment.patients[i].userKey);
        }
    } else {
        const { error } = patientAppointmentValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        createRequest(req.body.appointment.doctor.userKey);
    }
    
    

    // Update user
    user.appointments.push(req.body.appointment);

    try {
        const savedUser = await user.save();
        return res.send("Appointment created succesfully!");
    } catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

router.post('/delete', verify, async(req, res) => {
    let user = User.findOne({ _id: req.user });

    let rTitle = req.body.title;

    if(user.isVerifiedDoctor) {
        let data = user.appointments.find( ({ title }) => title === rTitle);
        for(var i in data.patients) {
            let aUser = User.findOne({ _id: data.patients[i].name });
            let aData = aUser.appointments.find( ({ title }) => title === rTitle);
            let notif = {
                type: 'Appointment deletion',
                title: data.title,
                from: 'Dr. ' + user.lastName,
                date: data.date,
                read: false
            }
            aUser.notification.push(notif);
            let index = user.appointments.indexOf(data);
            let aIndex = aUser.appointments.indexOf(aData);
            if(index >= 0) {
                user.appointments.splice(index, 1);
                aUser.appointments.splice(aIndex, 1);
                const savedUser = await user.save();
                let aSavedUser = await aUser.save();
                res.send('Deleted appointment');
            } else {
                res.send('Appointment doesn\'t exist');
            }
        }
    } else {
        let data = user.appointments.find( ({ title }) => title === rTitle);
        let aUser = User.findOne({ _id: data.doctor.name });
        let notif = {
            type: 'Appointment deletion',
            title: data.title,
            from: user.firstName + ' ' + user.lastName,
            date: data.date,
            read: false
        }
        aUser.notification.push(notif);
        let index = user.appointments.indexOf(data);
        let aIndex = aUser.appointments.indexOf(aData);
        if(index >= 0) {
            user.appointments.splice(index, 1);
            aUser.appointments.splice(aIndex, 1);
            const savedUser = await user.save();
            let aSavedUser = await aUser.save();
            res.send('Deleted appointment');
        } else {
            res.send('Appointment doesn\'t exist');
        }
    }
});

module.exports = router;