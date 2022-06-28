module.exports = (sequelize, DataTypes) =>{
    const User = sequelize.define("User", {
        userId: {
            type: DataTypes.UUID(),
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        mileage: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    },
        {
            charset:    "utf8", //한국어 설정
            collate:    "utf8_general_ci",  //한국어 설정
            tableName:  "User",    // 테이블 이름 정의
            timestamps: true,   // createAt, UpdateAt 활성화
            paranoid:   true    // deleteAt 옵션
        }
    );


    return User;
}