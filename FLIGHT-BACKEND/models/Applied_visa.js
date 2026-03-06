module.exports = (sequelize, DataTypes) => {
  const Applied_visa = sequelize.define("applied_visa", {
    refrense_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    visa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    visa_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    internal_ID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    group_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    front_passport_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    back_passport_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passport_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    motherName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fatherName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placeOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spouseName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    travelDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // returnDate: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },

    sex: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    entryPoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exitPoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    traveler_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pen_card_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pen_card_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additional_question: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_insurance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insurance_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_file_orignal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additional_folder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additional_folder_label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hotal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hotal_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "In Process",
    },
    working_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "In Process",
    },
  });

  return Applied_visa;
};
