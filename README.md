
================ START TEST ==============
(create an empty test)

POST /public/start-test 
Body :
{
  "email": "testuser@example.com",
  "name": "John",
  "lastname": "Doe",
  "aupair": true
}


============= GET QUESTIONS ================
(Public - no corrections)
GET /public/questions

(Admin - with corrections)
GET /questions/


============= SUBMIT RESPONSES =============
(Public)
POST /public/tests/:testId/responses
x-test-session-id: <sessionToken>

Body: 
[
  { "questionId": 1, "answerBool": true },
  { "questionId": 2, "answerBool": false }
]


========== CHECK TESTS ANSWERS =============
(Admin)
GET /tests/:testId 
Authorization : Bearer <admin_taken>


================ GET TESTS =================
(Adminn - All tests)
GET /tests/ 

(Admin - From user)
GET /admin/users/:userId/test/:testId

(Public - From user)
GET /tests/users/:userId


=============== ADD A QUESTION ==============
(Admin)
POST /questions 
Authorization: Bearer <admin_token>

Body: 

{
  "type": "QCM",
  "text": "Are you happy ?",
  "correctBool": true,
  "points": 4,
  "order": 3
}