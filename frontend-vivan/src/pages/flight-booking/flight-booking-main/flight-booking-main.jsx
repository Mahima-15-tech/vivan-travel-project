import React, { useState, useEffect } from "react";
import "../flight-booking-main/flight-booking-main.css";
import FlightBookingMainLeft from "../flight-booking-main/flight-booking-main-left";
import FlightBookingMainRight from "../flight-booking-main/flight-booking-main-right";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const FlightBookingMain = ({
  uData,
  data,
  traveltype,
  tripinfo,
  onUpdate,
  airlines,
  triptype,
  isisnetfarefromback,
}) => {
  // console.log(data)
  // const location = useLocation();
  // const FlightData = data[0].flight;
  // const Search_Key = data[0].Search_Key;
  // const fareid = data[0].fareid;
  const charges = data[0].charges;
  const adult = data[0].adultcount;
  // const faredetails = data[0].item;

  const agencycharge = data[0].agencycharge;
  const useragencycharge = data[0].uData;
  // uData && uData.type === "2"
  //   ? uData.agents.flight_charges['1'] ?? "0"
  //   :
  // data[0].uData;
  let sum = 0;
  let sumwithcommission = 0;
  let tempsum = 0;
  let tempsumwithcommission = 0;
  data.forEach((element) => {
    // Calculate sum for each element

    const agencyChargeval = Number(agencycharge["1"] ?? "0");

    const fareAdult = Number(
      element.item.FareDetails.find((fare) => fare.PAX_Type === 0)
        ?.Total_Amount || 0
    );
    const fareChild = Number(
      element.item.FareDetails.find((fare) => fare.PAX_Type === 1)
        ?.Total_Amount || 0
    );
    const fareInfant = Number(
      element.item.FareDetails.find((fare) => fare.PAX_Type === 2)
        ?.Total_Amount || 0
    );

    // const serviceFeeAdult = Number(
    //   element.item.FareDetails.find((fare) => fare.PAX_Type === 0)
    //     ?.Service_Fee_Amount || 0
    // );
    // const serviceFeeChild = Number(
    //   element.item.FareDetails.find((fare) => fare.PAX_Type === 1)
    //     ?.Service_Fee_Amount || 0
    // );
    // const serviceFeeInfant = Number(
    //   element.item.FareDetails.find((fare) => fare.PAX_Type === 2)
    //     ?.Service_Fee_Amount || 0
    // );

    const adultCount = Number(adult.adult || 0);
    const childCount = Number(adult.child || 0);
    const infantCount = Number(adult.infant || 0);

    tempsum +=
      (fareAdult + Number(agencyChargeval)) * adultCount +
      (fareChild + Number(agencyChargeval)) * childCount +
      (fareInfant + Number(agencyChargeval)) * infantCount;
    //  +
    // (serviceFeeAdult * adultCount +
    //   serviceFeeChild * childCount +
    //   serviceFeeInfant * infantCount);

    // afetr decut commison
    tempsumwithcommission +=
      (Number(
        element.item.FareDetails.find((fare) => fare.PAX_Type === 0)
          ?.Total_Amount || 0
      ) -
        Number(
          element.item.FareDetails.find((fare) => fare.PAX_Type === 0)
            ?.Net_Commission || 0
        ) +
        Number(uData?.agents?.flight_charges?.["1"] ?? "0")) *
        Number(adult.adult || 0) +
      (Number(
        element.item.FareDetails.find((fare) => fare.PAX_Type === 1)
          ?.Total_Amount || 0
      ) -
        Number(
          element.item.FareDetails.find((fare) => fare.PAX_Type === 1)
            ?.Net_Commission || 0
        ) +
        Number(uData?.agents?.flight_charges?.["1"] ?? "0")) *
        Number(adult.child || 0) +
      (Number(
        element.item.FareDetails.find((fare) => fare.PAX_Type === 2)
          ?.Total_Amount || 0
      ) -
        Number(
          element.item.FareDetails.find((fare) => fare.PAX_Type === 2)
            ?.Net_Commission || 0
        ) +
        Number(uData?.agents?.flight_charges?.["1"] ?? "0")) *
        Number(adult.infant || 0);
    //   +
    // (Number(
    //   element.item.FareDetails.find((fare) => fare.PAX_Type === 0)
    //     ?.Service_Fee_Amount || 0
    // ) *
    //   Number(adult.adult || 0) +
    //   Number(
    //     element.item.FareDetails.find((fare) => fare.PAX_Type === 1)
    //       ?.Service_Fee_Amount || 0
    //   ) *
    //     Number(adult.child || 0) +
    //   Number(
    //     element.item.FareDetails.find((fare) => fare.PAX_Type === 2)
    //       ?.Service_Fee_Amount || 0
    //   ) *
    //     Number(adult.infant || 0));
  });

  const [selectedssrOptions, setSelectedssrOptions] = useState([]);
  useEffect(() => {
    if (repricedata) {
      handleReprice({ AirRepriceResponses: repricedata });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedssrOptions]);
  const ssrsum = selectedssrOptions.reduce((total, item) => {
    return total + item.Total_Amount; // Add the amount if it exists, otherwise add 0
  }, 0);

  const [bookingamount, setBookingamount] = useState(
    Number(sum) + Number(ssrsum)
  );
  const [bookingamountwithcommission, setBookingamountwithcommission] =
    useState(Number(sumwithcommission) + Number(ssrsum));
  const [repricedata, setrepricedata] = useState(null);
  // Function to update booking amount and booking amount with commission
  const handleReprice = (dataofreprice) => {
    let resum = 0;
    let resumwithcommission = 0;
    setrepricedata(dataofreprice.AirRepriceResponses);
    // console.log("Reprice Responses:", dataofreprice.AirRepriceResponses);
    // console.log("data:", data);
    data.forEach((element, index) => {
      const flightforreprice = dataofreprice.AirRepriceResponses[index]?.Flight;
      // console.log("flightforreprice:", flightforreprice);
      const FareDetailsofreprice =
        flightforreprice.Fares?.find(
          (item) => item.Fare_Id === element.item.Fare_Id
        )?.FareDetails ||
        flightforreprice.Fares?.at(0)?.FareDetails ||
        [];
      // Calculate sum for each element
      // console.log(`FareDetailsofreprice [${index}]:`, FareDetailsofreprice);
      const agencyChargeval = Number(agencycharge["1"] ?? "0");

      const fareAdult = Number(
        FareDetailsofreprice.find((fare) => fare.PAX_Type === 0)
          ?.Total_Amount || 0
      );
      const fareChild = Number(
        FareDetailsofreprice.find((fare) => fare.PAX_Type === 1)
          ?.Total_Amount || 0
      );
      const fareInfant = Number(
        FareDetailsofreprice.find((fare) => fare.PAX_Type === 2)
          ?.Total_Amount || 0
      );

      const serviceFeeAdult = Number(
        FareDetailsofreprice.find((fare) => fare.PAX_Type === 0)
          ?.Service_Fee_Amount || 0
      );
      const serviceFeeChild = Number(
        FareDetailsofreprice.find((fare) => fare.PAX_Type === 1)
          ?.Service_Fee_Amount || 0
      );
      const serviceFeeInfant = Number(
        FareDetailsofreprice.find((fare) => fare.PAX_Type === 2)
          ?.Service_Fee_Amount || 0
      );

      const adultCount = Number(adult.adult || 0);
      const childCount = Number(adult.child || 0);
      const infantCount = Number(adult.infant || 0);

      // console.log("fareAdult:", fareAdult, "adultCount:", adultCount);
      // console.log("fareChild:", fareChild, "childCount:", childCount);
      // console.log("fareInfant:", fareInfant, "infantCount:", infantCount);
      // console.log("agencyChargeval:", agencyChargeval);
      // console.log("serviceFeeAdult:", serviceFeeAdult);
      // console.log("serviceFeeChild:", serviceFeeChild);
      // console.log("serviceFeeInfant:", serviceFeeInfant);

      resum +=
        (fareAdult + Number(agencyChargeval)) * adultCount +
        (fareChild + Number(agencyChargeval)) * childCount +
        (fareInfant + Number(agencyChargeval)) * infantCount;
      //  +
      // (serviceFeeAdult * adultCount +
      //   serviceFeeChild * childCount +
      //   serviceFeeInfant * infantCount
      // );

      // afetr decut commison
      resumwithcommission +=
        (Number(
          FareDetailsofreprice.find((fare) => fare.PAX_Type === 0)
            ?.Total_Amount || 0
        ) -
          Number(
            FareDetailsofreprice.find((fare) => fare.PAX_Type === 0)
              ?.Net_Commission || 0
          ) +
          Number(uData?.agents?.flight_charges?.["1"] ?? "0")) *
          Number(adult.adult || 0) +
        (Number(
          FareDetailsofreprice.find((fare) => fare.PAX_Type === 1)
            ?.Total_Amount || 0
        ) -
          Number(
            FareDetailsofreprice.find((fare) => fare.PAX_Type === 1)
              ?.Net_Commission || 0
          ) +
          Number(uData?.agents?.flight_charges?.["1"] ?? "0")) *
          Number(adult.child || 0) +
        (Number(
          FareDetailsofreprice.find((fare) => fare.PAX_Type === 2)
            ?.Total_Amount || 0
        ) -
          Number(
            FareDetailsofreprice.find((fare) => fare.PAX_Type === 2)
              ?.Net_Commission || 0
          ) +
          Number(uData?.agents?.flight_charges?.["1"] ?? "0")) *
          Number(adult.infant || 0);
      //    +
      // (
      //   Number(
      //   FareDetailsofreprice.find((fare) => fare.PAX_Type === 0)
      //     ?.Service_Fee_Amount || 0
      // ) *
      //   Number(adult.adult || 0) +
      //   Number(
      //     FareDetailsofreprice.find((fare) => fare.PAX_Type === 1)
      //       ?.Service_Fee_Amount || 0
      //   ) *
      //     Number(adult.child || 0) +
      //   Number(
      //     FareDetailsofreprice.find((fare) => fare.PAX_Type === 2)
      //       ?.Service_Fee_Amount || 0
      //   ) *
      //     Number(adult.infant || 0));
    });
    const ressrsum = selectedssrOptions.reduce((total, item) => {
      return total + item.Total_Amount; // Add the amount if it exists, otherwise add 0
    }, 0);

    setBookingamount(Number(resum) + Number(ressrsum));
    setBookingamountwithcommission(
      Number(resumwithcommission) + Number(ressrsum)
    );
    // console.log("Booking Amount:", resum);
    // console.log("Booking Amount with Commission:", resumwithcommission);
    // if (updatedItem && typeof updatedItem.bookingamount === "number" && typeof updatedItem.bookingamountwithcommission === "number") {
    //   setBookingamount(updatedItem.bookingamount);
    //   setBookingamountwithcommission(updatedItem.bookingamountwithcommission);
    // }
  };

  return (
    <section className="flight-booking">
      <div className="contain">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="row">
          <FlightBookingMainLeft
            data={data}
            traveltype={traveltype}
            tripinfo={tripinfo}
            bookingamount={bookingamount}
            bookingamountwithcommission={bookingamountwithcommission}
            onupdatessr={(updatedItem) => {
              setSelectedssrOptions(updatedItem.list);
            }}
            reprice={(AirRepriceResponses) => {
              handleReprice(AirRepriceResponses);
              // setBookingamount(updatedItem.bookingamount);
              // setBookingamountwithcommission(updatedItem.bookingamountwithcommission);
            }}
            oldfare={{ sum: tempsum, withcommission: tempsumwithcommission }}
            triptype={triptype}
            isisnetfarefromback={isisnetfarefromback}
            agencycharge={agencycharge}
          />

          <FlightBookingMainRight
            data={data}
            uData={uData}
            repricedata={repricedata}
            ssrselect={selectedssrOptions}
            bookingamount={bookingamount}
            bookingamountwithcommission={bookingamountwithcommission}
            onUpdate={(updatedItem) => {
              onUpdate({});
            }}
            airlines={airlines}
            isisnetfarefromback={isisnetfarefromback}
            agencycharge={agencycharge}
            useragencycharge={useragencycharge}
          />
        </div>
      </div>
    </section>
  );
};
// aa

export default FlightBookingMain;
