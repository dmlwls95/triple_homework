const db = require('../models');
const User = db.user;
const Mileagehistory = db.mileagehistory;

module.exports = {
    async ReviewADDEvent(req,res){
        // 이미 해당 장소에 리뷰를 남겼다면 리뷰를 추가하지 않음 && 지운 이력이 있고 지운 이력후에 추가한적이 있다면 리뷰를 추가하지 않음
        const isreviewed = await Mileagehistory.findOne({ where: { placeId: req.body.placeId, userId: req.body.userId, action: 'ADD' }, order: [['updatedAt', 'DESC']] });
        const reviewDeleted = await Mileagehistory.findOne({ where: { placeId: req.body.placeId, userId: req.body.userId, action: 'DELETE' }, order: [['updatedAt', 'DESC']] });
        if (( isreviewed && !reviewDeleted ) || (reviewDeleted && (reviewDeleted.updatedAt < isreviewed.updatedAt)) ) {
            return res.status(401).send('you already reviewd this place');
        }
        // 유저가 존재하지 않으면 리턴
        // line:73 에서 마일리지 적립을 위해 다시 사용
        let user = await User.findByPk(req.body.userId);
        if(!user){
            return res.status(404).send('user is not exist.');
        }

        let hasPhoto = false;   // 리뷰에 사진이 포함되어 있는지 확인
        let hasText = false;    // 리뷰에 내용이 존재하는지 확인
        let isFirst = false;    // 해당 장소가 처음 작성하는지 확인
        let totalScore = 0;     // 위 점수 합계

        // 사진이 포함되어있다면 점수 +1
        if (req.body.attachedPhotoIds.length > 0) {
            hasPhoto = true;
            totalScore += 1;
        }
        // 내용이 있다면 점수 +1
        if (req.body.content) {
            hasText = true;
            totalScore += 1;
        }

        // 첫 방문이라면 점수 +1 (장소에 대한 리뷰가 하나도 없거나 || 있더라도 isFirst 인덱스로 남긴 가장 최근 리뷰가 이미 삭제된 상태라면 첫방문)
        // [사용자 입장에서 본 첫 리뷰 기준]
        const placehistory = await Mileagehistory.findOne({ where: { placeId: req.body.placeId } });
        const isremoved = await Mileagehistory.findOne({
            where: {
                placeId: req.body.placeId,
                isFirst: true,
                action: 'DELETE'
            },
            order: [['updatedAt', 'DESC']]
        })
        const recenthistory = await Mileagehistory.findOne({
            where: {
                placeId: req.body.placeId,
                isFirst: true,
                action: 'ADD'
            },
            order: [['updatedAt', 'DESC']]
        })
        if (!placehistory || (isremoved && (isremoved.updatedAt > recenthistory.updatedAt))) {
            isFirst = true
            totalScore += 1;
        }

        // 위의 점수를 대입해서 Mileagehistory에 추가하고 user 에도 마일리지 점수를 기록함
        const history = {
            type: req.body.type,
            action: req.body.action,    //생성 이벤트의 경우 'ADD', 수정이벤트는 'MOD', 삭제 이벤트는 'DELETE'
            userId: req.body.userId,
            reviewId: req.body.reviewId,
            placeId: req.body.placeId,
            hasText: hasText,
            hasPhoto: hasPhoto,
            isFirst: isFirst
        }
        await Mileagehistory.create(history);
        
        if (user) {
            user.mileage += totalScore;
            user.save();
            return res.status(200).send('review successfully added');
        }
    },

    async ReviewMODEvent(req, res){
        // 유저가 존재하지 않을 경우 404
        let user = await User.findByPk(req.body.userId);
        if (!user) return res.status(404).send('user is not exist.');

        const addhistory = await Mileagehistory.findOne({
            where: {
                action: 'ADD',
                placeId: req.body.placeId,
                userId: req.body.userId,
                reviewId: req.body.reviewId
            },
            order: [['updatedAt', 'DESC']]
        });
        const deletehistory = await Mileagehistory.findOne({
            where: {
                action: 'DELETE',
                placeId: req.body.placeId,
                userId: req.body.userId,
                reviewId: req.body.reviewId
            },
            order: [['updatedAt', 'DESC']]
        })
        // 추가한 기록이 없거나 이미 지워진 경우(최근 추가한 기록 날짜보다 삭제한 날짜가 최신일 경우) 404, 401에러
        if (!addhistory) return res.status(404).send('There is not history.');
        if ((deletehistory && (deletehistory.updatedAt > addhistory.updatedAt))) return res.status(401).send('It was already deleted');
        
        let existScore = 0;     // 기존에 추가했던 리뷰의 점수
        if (addhistory.hasText) existScore += 1;
        if (addhistory.hasPhoto) existScore += 1;
        if (addhistory.isFirst) existScore += 1;

        let hasPhoto = false;   // 리뷰에 사진이 포함되어 있는지 확인
        let hasText = false;    // 리뷰에 내용이 존재하는지 확인
        let isFirst = false;    // 해당 장소가 처음 작성하는지 확인
        let totalScore = 0;     // 위 점수 합계


        // 사진이 포함되어있다면 점수 +1
        if (req.body.attachedPhotoIds.length > 0) {
            hasPhoto = true;
            totalScore += 1;
        }
        // 내용이 있다면 점수 +1
        if (req.body.content) {
            hasText = true;
            totalScore += 1;
        }
        // 기존 첫 방문 리뷰라면 점수 +1
        if (addhistory.isFirst) {
            isFirst = true
            totalScore += 1;
        }

        // 위의 점수를 대입해서 Mileagehistory에 추가하고 user 에도 마일리지 점수를 기록함
        const history = {
            type: req.body.type,
            action: req.body.action,    //생성 이벤트의 경우 'ADD', 수정이벤트는 'MOD', 삭제 이벤트는 'DELETE'
            userId: req.body.userId,
            reviewId: req.body.reviewId,
            placeId: req.body.placeId,
            hasText: hasText,
            hasPhoto: hasPhoto,
            isFirst: isFirst
        }
        await Mileagehistory.create(history);

        if (user) {
            user.mileage -= existScore;
            user.mileage += totalScore;
            user.save();
            return res.status(200).send('review successfully modded');
        }
    },

    async ReviewDELETEEvent(req, res) {
        // 유저가 존재하지 않을 경우 404
        let user = await User.findByPk(req.body.userId);
        if (!user)  return res.status(404).send('user is not exist.');

        const addhistory = await Mileagehistory.findOne({
            where: {
                action: !'DELETE',
                placeId: req.body.placeId,
                userId: req.body.userId,
                reviewId: req.body.reviewId
            },
            order: [['updatedAt', 'DESC']]
        });
        const deletehistory = await Mileagehistory.findOne({
            where: {
                action: 'DELETE',
                placeId: req.body.placeId,
                userId: req.body.userId,
                reviewId: req.body.reviewId
            },
            order: [['updatedAt', 'DESC']]
        })
        // 추가한 기록이 없거나 이미 지워진 경우(최근 추가한 기록 날짜보다 삭제한 날짜가 최신일 경우) 404, 401에러
        if(!addhistory) return res.status(404).send('There is not history.');
        if((deletehistory && (deletehistory.updatedAt > addhistory.updatedAt))) return res.status(401).send('It was already deleted');

        const history = {
            type: req.body.type,
            action: req.body.action,    //생성 이벤트의 경우 'ADD', 수정이벤트는 'MOD', 삭제 이벤트는 'DELETE'
            userId: req.body.userId,
            reviewId: req.body.reviewId,
            placeId: req.body.placeId,
            hasText: addhistory.hasText,
            hasPhoto: addhistory.hasPhoto,
            isFirst: addhistory.isFirst
        }
        // DELETE히스토리를 만듦
        await Mileagehistory.create(history);
        
        // 해당 리뷰로 더해졌던 마일리지를 합산
        let minusScore = 0;
        if(addhistory.hasText)    minusScore += 1;
        if(addhistory.hasPhoto)   minusScore += 1;
        if(addhistory.isFirst)    minusScore += 1;
        
        //해당 리뷰의 마일리지를 빼고 저장함
        user.mileage -= minusScore;
        user.save();
        res.status(200).send('review successfully deleted');


    }
}