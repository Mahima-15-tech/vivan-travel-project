// export const SERVER_URL = "https://api.vivantravels.com/";
// export const SERVER_URL = "https://flightbackend.readytouse.in/";
export const SERVER_URL = "https://vivan-backend.onrender.com/";
export const API_BASE_URL = SERVER_URL + "api/";
export const IMAGE_BASE_URL = SERVER_URL + "public/";

export async function AIR_2_URL() {
  let setting = null;
  let settingFromSession = sessionStorage.getItem("settting");
  if (settingFromSession && settingFromSession != null) {
    setting = JSON.parse(settingFromSession);
  }
  return setting.etrav_api_prod_on == 1
    ? setting.etrav_api_uat_url + "/flight/AirAPIService.svc/JSONService/"
    : setting.etrav_api_prod_url +
    "/tradehost/TradeAPIService.svc/JSONService/";
}

export async function AIR_3_URL() {
  let setting = null;
  let settingFromSession = sessionStorage.getItem("settting");
  if (settingFromSession && settingFromSession != null) {
    setting = JSON.parse(settingFromSession);
  }
  return setting.etrav_api_prod_on == 1
    ? setting.etrav_api_uat_url + "/airlinehost/AirAPIService.svc/JSONService/"
    : setting.etrav_api_prod_url +
    "/airlinehost/AirAPIService.svc/JSONService/";
}

export const login = "admin/admin_login";
export const dashboard = "home/";
export const admin_profile = "admin/admin_profile";
export const admin_profile_update = "admin/admin_profile_update";
export const admin_password_update = "admin/admin_password_update";

export const searchbooking = "booking/searchbooking";
export const userdetails = "auth/";
export const users_list = "user/users_list";
export const update_user_status = "user/update_user_status";
export const update_account = "user/update_account";
export const update_update_account = "user/update_account";
export const user_list_other = "user/user_list_other";
export const withdrawlist = "user/withdrawlist";
export const withdrawupdate = "user/withdrawupdate";

export const support_list = "support/list";
export const feedback_list = "support/feedbacklist";
export const support_update = "support/update";
export const deleteFeedback = "support/deleteFeedback";

export const interest_add = "interest/add";
export const interest_list = "interest/list";
export const interest_delete = "interest/delete";

export const report_list = "report/list";

export const add_faq_category = "faq/add";
export const faq_category_list = "faq/list";
export const faq_category_delete = "faq/delete";

export const faq_add = "faq/add_faq";
export const faq_list = "faq/faq_list";
export const faq_delete = "faq/faq_delet";

export const language_add = "language/add";
export const language_list = "language/list";
export const language_delete = "language/delete";

export const settings = "setting/settings";
export const siteconfig = "setting/settings";
export const updateSettings = "setting/updateSettings";
export const maincountry_list = "country/mainlist";
export const maincountry_add = "country/mainadd";

export const visalist = "visa/list";
export const visa_add = "visa/add";
export const update_visas = "visa/update_status";
export const update_applied_status = "visa/update_applied_status";
export const visa_details = "visa/get_details";
export const appliedlist = "visa/applied_list";
export const applied_visa_details = "visa/applied_visa_details";
export const get_applied_visa_details = "visa/get_applied_visa_details";

export const otblist = "oktb/list";
export const update_oktbs = "oktb/update_status";
export const oktb_details = "oktb/get_details";

export const agent_list = "agent/list";
export const agent_update_status = "agent/update_status";
export const agent_details = "agent/get_details";
export const flight_apis = "agent/flight_apis";
export const visa_agent_charge = "agent/visa_agent_charge";
export const visa_agent_charge_add = "agent/visa_agent_charge_add";

export const history_list = "wallet/History";

export const country_list = "country/list";
export const country_update = "country/update";
export const country_add = "country/add";

export const applied_tickets = "booking/applied_list";
export const tickets_update_status = "booking/update_status";
export const cancel_tickets = "booking/cancle_list";
export const cancle_booking_update = "booking/cancle_booking_update";
export const ticket_details = "booking/get_ticket_details";
export const S_Booking_list = "booking/S_Booking_list";
export const Series_update_status = "booking/Series_update_status";
export const Series_Booking_details = "booking/Series_Booking_details";

export const country_status_list = "country/mainlist";
export const country_status_update = "country/mainupdate";
export const country_status_add = "country/mainadd";
export const airlinelist = "airline/list";
export const airlineaddupdate = "airline/add";
export const listAirlinePrices = "airline/listAirlinePrices";
export const createOrUpdateAirlinePrice = "airline/createOrUpdateAirlinePrice";
export const send_notification = "comman/send_notification";

export const third_party = "third_party/fetch";
export const third_party_2 = "third_party/fetch_get";

export const AIR_IQ = "https://omairiq.azurewebsites.net/";
export const AIR_PAY = "AddPayment";
export const AIR_REPRINT = "Air_Reprint";

// OFFLINE TICKET BOOKING
export const offline_ticket_add = "offline_ticket/add";
export const offline_ticket_list = "offline_ticket/list";
export const offline_ticket_update = "offline_ticket/update";
