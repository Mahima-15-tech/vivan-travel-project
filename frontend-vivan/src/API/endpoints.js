// export const SERVER_URL = "http://192.168.31.218:1028/";
// export const SERVER_URL = "https://flightbackend.readytouse.in/";
// export const SERVER_URL = "https://api.vivantravels.com/";
export const SERVER_URL = "http://localhost:4000/";
export const API_BASE_URL = SERVER_URL + "api/";
export const IMAGE_BASE_URL = SERVER_URL + "";
export const siteconfig = "setting/settings";

export async function AIR_2_URL() {
  let setting = null;
  let settingFromSession = sessionStorage.getItem("settting");
  if (settingFromSession && settingFromSession != null) {
    setting = JSON.parse(settingFromSession);
  }
  return setting.etrav_api_prod_on === 1
    ? setting.etrav_api_uat_url + "/flight/AirAPIService.svc/JSONService/"
    : setting.etrav_api_prod_url +
    "/airlinehost/AirAPIService.svc/JSONService/";
}

export async function AIR_3_URL() {
  let setting = null;
  let settingFromSession = sessionStorage.getItem("settting");
  if (settingFromSession && settingFromSession != null) {
    setting = JSON.parse(settingFromSession);
  }
  return setting.etrav_api_prod_on === 1
    ? setting.etrav_api_uat_url + "/trade/TradeAPIService.svc/JSONService/"
    : setting.etrav_api_prod_url +
    "/tradehost/TradeAPIService.svc/JSONService/";
}

export async function AIR_4_URL() {
  let setting = null;
  let settingFromSession = sessionStorage.getItem("settting");
  if (settingFromSession && settingFromSession != null) {
    setting = JSON.parse(settingFromSession);
  }
}

export const dashboard = "home/";
export const admin_profile = "auth/admin_profile";
export const admin_profile_update = "auth/admin_profile_update";
export const admin_password_update = "auth/admin_password_update";

export const account_login = "user/account_login";
export const create_account = "user/create_account";
export const update_account = "user/update_account";
export const update_password = "user/update_password";
export const users_profile = "user/users_profile";
export const account_logout = "user/logout";
export const forget_password = "user/forget_password";
export const agent_list = "agent/list";
export const search_visa = "visa/search";
export const details_visa = "visa/get_details";
export const get_applied_visa_details = "visa/get_applied_visa_details";
export const apply_visa = "visa/apply_visa_bulk";
export const save_as_draft = "visa/save_as_draft";
export const applied_visa_list = "visa/applied_list";
export const visa_delete = "visa/visa_delete";
export const applied_visa_details = "visa/applied_visa_details";
export const payment_check = "wallet/payment_check";
export const oktb_create = "oktb/add";
export const applied_oktb_list = "oktb/applied_list";

export const support_add = "support/add";

export const add_faq_category = "faq/add";
export const faq_category_list = "faq/list";
export const faq_category_delete = "faq/delete";

export const faq_add = "faq/add_faq";
export const faq_list = "faq/faq_list";
export const faq_delete = "faq/faq_delet";

export const language_add = "language/add";
export const language_list = "language/list";
export const language_delete = "language/delete";

export const updateSettings = "setting/updateSettings";

export const add_subscription = "subscription/add";
export const list_subscription = "subscription/list";
export const del_subscription = "subscription/del";
export const purchage_subscription_list =
  "subscription/purchage_subscription_list";

export const add_question = "question/add";
export const list_question = "question/list";
export const del_question = "question/delete";

export const country_list = "country/list";
export const maincountry_list = "country/mainlist";
export const booking_add = "booking/add";
export const booking_add_v2 = "booking/addv2";
export const searchbooking = "booking/searchbooking";
export const booking_update = "booking/update";
export const booking_list = "booking/list";
export const ticket_details = "booking/get_ticket_details";
export const s_ticket_Details = "booking/s_ticket_Details";
export const booking_cancle = "booking/cancle_booking";
export const Series_Booking = "booking/Series_Booking";
export const Series_Booking_list = "booking/Series_Booking_list";
export const Series_Booking_details = "booking/Series_Booking_details";

export const wallet_add = "wallet/add";
export const wallet_list = "/wallet/list";
export const airline_list = "/airline/list";
export const listAirlinePrices = "/airline/listAirlinePrices";
export const airline_code = "/airline/singledata";

export const third_party = "third_party/fetch";
export const third_party_2 = "third_party/fetch_get";
export const AIR_SEARCH = "Air_Search";
export const AIR_FARERULE = "Air_FareRule";
export const AIR_REPRICE = "Air_Reprice";
export const AIR_PAY = "AddPayment";
export const AIR_BOOKING = "Air_TempBooking";
export const AIR_CANCELLATION = "Air_TicketCancellation";
export const AIR_TICKETING = "Air_Ticketing";
export const AIR_REPRINT = "Air_Reprint";
export const AIR_GETSSR = "Air_GetSSR";
export const AIR_GETSEATMAP = "Air_GetSeatMap";
export const send_notification = "comman/send_notification";
export const submitfeedback = "support/submitfeedback";
export const feedbacklist = "support/feedbacklist";

export const api_logs = "comman/save_api_logs";

export const AIR_IQ_LOGIN = "login";
export const AIR_IQ_SEARCH = "search";
export const AIR_IQ_BOOKING = "book";
export const GET_APIS = "comman/get_api";
export const AIR_IQ = "https://omairiq.azurewebsites.net/";


