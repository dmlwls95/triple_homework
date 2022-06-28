//hme.route.js
const express = require('express');
const { Op } = require('sequelize');
const db = require('../models');
const User = db.user;
const mileageRoutes = express.Router();
const ReviewCtrl = require('../controllers/review.controller.js');
// require models
mileageRoutes.post('/', async (req, res) => {
    if( req.body.type === 'REVIEW' ){ // 미리 지정된 이벤트 타입 (리뷰 이벤트의 경우 'REVIEW')
        if (req.body.action === 'ADD') { //생성 이벤트의 경우 'ADD', 수정이벤트는 'MOD', 삭제 이벤트는 'DELETE'
            return ReviewCtrl.ReviewADDEvent(req, res);
        } else if (req.body.action === 'MOD'){
            return ReviewCtrl.ReviewMODEvent(req, res);
        } else if (req.body.action === 'DELETE') {
            return ReviewCtrl.ReviewDELETEEvent(req, res);
        }
    }
    
})

mileageRoutes.post('/user', async (req, res)=>{
    const user = {
        name: req.body.name
    }
    await User.create(user)
    res.status(200).send('success');
})

mileageRoutes.post('/mileage', async (req, res) => {
    const user = await User.findByPk(req.body.userId);
    res.status(200).send({mileage: user.mileage});
})

module.exports = mileageRoutes;