module.exports = (sequelize, DataTypes) => {
  const countrystatus = sequelize.define("countrystatus", {
    country_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    allow_for_visa: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_otb: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pp_front: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pp_front_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pp_back: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pp_back_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pancard: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pancard_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pancard_no: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pancard_no_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pp_no: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_pp_no_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_first_name_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_last_name_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_nationalty: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_nationalty_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_checkinpoint: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_checkinpoint_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_checkoutpoint: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_checkoutpoint_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_additional_folder: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_additional_folder_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_additional_folder_label: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    allow_for_insurance: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_insurance_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_occupation: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_occupation_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_photo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_photo_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_hotal_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_hotal_name_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },


    allow_for_hotal_voucher: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_hotal_voucher_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },


    allow_for_travel_date: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_travel_date_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_gender: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_gender_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_dob: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_dob_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_mothername: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_mothername_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_fathername: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_fathername_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_place_of_birth: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_place_of_birth_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_spouse_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
    allow_for_spouse_name_required: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yes",
    },
  });

  return countrystatus;
};
