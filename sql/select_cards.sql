select 
    json_extract(ObjectJSON, '$.id.S') as id
    ,json_extract(ObjectJSON, '$.question.S') as question
    ,json_extract(ObjectJSON, '$.answer.S') as answer
    ,json_extract(ObjectJSON, '$.showed.N') as showed
    ,json_extract(ObjectJSON, '$.wrong.N') as wrong
    ,json_extract(ObjectJSON, '$.correct.N') as correct
    ,json_extract(ObjectJSON, '$.owner.S') as owner

    ,json_extract(ObjectJSON, '$.interval.N') as interval
    ,json_extract(ObjectJSON, '$.repetitions.N') as repetitions
    ,json_extract(ObjectJSON, '$.easiness.N') as easiness
    ,json_extract(ObjectJSON, '$.nextPractice.N') as nextPractice
from CardTable;

--delete from CardTable
--where json_extract(ObjectJSON, '$.id.S') = 'c3a20435-da21-482f-8e48-f64eff72c4aa';