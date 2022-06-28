module.exports = (sequelize, DataTypes) => {
    const Mileagehistory = sequelize.define("Mileagehistory", {
        historyId: {
            type: DataTypes.UUID(),
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID(),
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        reviewId: {
            type: DataTypes.UUID(),
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        placeId: {
            type: DataTypes.UUID(),
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        hasText: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        hasPhoto: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isFirst: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
        {
            charset: "utf8", //한국어 설정
            collate: "utf8_general_ci",  //한국어 설정
            tableName: "Mileagehistory",    // 테이블 이름 정의
            timestamps: true,   // createAt, UpdateAt 활성화
            paranoid: true    // deleteAt 옵션
        }
    );


    return Mileagehistory;
}