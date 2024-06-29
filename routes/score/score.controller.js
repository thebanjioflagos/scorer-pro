const express = require('express');
const { getScores, addScore, updateScore, deleteScore } = require('./score.service');
const { ScoreDTOValidator, addScoreDTO, updateScoreDTO, deleteScoreDTO } = require('../../validators/score.validators');
const router = express.Router();

//Get scores by Game ID
/* GET home page. */
router.get('/:gameId', async(req, res, next)=> {
    const {gameId} = req.params;
    const scores = await getScores(gameId);
    res.json({ 
    data: scores
  });
});

//add a new score
router.post('/', ScoreDTOValidator(addScoreDTO),async (req, res, next) =>{
    const{gameId, userId, score} = req.body;
    try{
        const savedScore = await addScore({gameId, userId, score});
        res.json({
            data: savedScore
    });
} catch (err) {
    if (err.code === 11000) {
        // Duplicate key error
        res.status(400).json({ error: 'Duplicate entry for userId and gameId' });
    } else {
        next(err);
    }
}
});

//update the  existing score
router.put('/:gameId', ScoreDTOValidator(updateScoreDTO), async (req, res, next) =>{
    const{gameId} = req.params;
    const{ userId, score} = req.body;
    try{
        const updatedScore = await updateScore({gameId, userId, score});
        if(updatedScore = null){
            return res.status(404).json({
                error:'Score not found'
            });
        }
        res.json({
            data: updatedScore
    });
    } catch(err){
        next(err);
    }

});

router.delete('/:gameId', ScoreDTOValidator(deleteScoreDTO), async(req, res, next) =>{
    const{gameId} = req.params;
    const{ userId} = req.body;
    try{
        const deletedScore = await deleteScore({gameId, userId});
        if (deletedScore === null) {
            return res.status(404).json({
              error: 'Score not found'
            });
          }
        res.json({
        data: deletedScore
    });
    }
    catch(err){
        next(err);
    }
});


module.exports = router;
