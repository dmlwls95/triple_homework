# triple_homework

##설치 및 실행
```
1. git clone https://github.com/dmlwls95/triple_homework.git
2. npm install
3. config폴더의 config.json파일의 username과 password, host를 설치된 mysql환경에 맞게 변경해주세요.
4. node server.js
5. /events/user 포인트에 아래의 형식으로 요청해주세요.
{
  "name": "이름"
}
```
##파일 구조
```
triple_club_mileage
 ┣ config
 ┃ ┗ config.json
 ┣ controllers
 ┃ ┗ review.controller.js
 ┣ migrations
 ┣ models
 ┃ ┣ index.js
 ┃ ┣ mileagehistory.js
 ┃ ┗ user.js 
 ┣ routes
 ┃ ┗ mileage.route.js
 ┣ seeders
 ┣ package-lock.json
 ┣ package.json
 ┣ server.js
 ┗ triple_ddl.sql
```

## 부가 설명
```
ORM(Sequelize 라이브러리)를 사용하여 개발했습니다. ddl을 사용하지 않아도 자동으로 DB가 생성됩니다.
triple_ddl.sql 파일을 확인해서 스키마와 테이블에 대한 ddl을 확인 하실 수 있습니다.
4000번 포트 혹은 프로세스 환경의 포트에 따라서 구현되어 있습니다.
```

## End points

###총 3개의 엔드포인트가 있습니다.
##POST /events
```
클럽 마일리지가 구현되어 있습니다.
사용자는 장소마다 하나의 리뷰를 남길 수 있고 성공적으로 추가 되었을 경우
review successfully added 메세지와 Status: 200이 출력됩니다.
```
##POST /events/user
```
이벤트 리뷰를 남기기 위한 유저를 생성하는 포인트 입니다.
성공적으로 생성 될경우
success메세지와 Status: 200이 출력됩니다.
```
##POST /events/mileage
```
현재 시점의 마일리지 확인을 위한 포인트 입니다.
아래의 형태로 보내면 포인트를 확인 할 수 있습니다.
{
  "userId": "유저id"
}
```
