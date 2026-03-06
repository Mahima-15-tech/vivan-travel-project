import React from 'react';
import '../../../Assets/css/CloseButton.css';

const List = ({ Data }) => {
    return (
      <tr>
        <td className="text-center">{Data.id || "-"}</td>
        <td className="text-center">{Data.tusers.name || "-"}</td>
        <td className="text-center">
          <div className="mb-1">
            <strong> {Data.tusers.email}</strong>
          </div>
          {Data.tusers.mobile_no}
        </td>
        <td className="text-center">
          <div className="text-center">
            {Data.order_id
              ? Data.order_id == "[object Object]"
                ? "Empty"
                : Data.order_id == "undefined"
                ? "Empty"
                : Data.order_id
              : "Empty"}
          </div>
        </td>
        <td className="text-center">{Data.amount || "-"}</td>
        <td className="text-center">
          {(Data.payment_getway || "-") == "Rezorpay" ? "Online" : "Wallet"}
        </td>
        <td className="text-center">{Data.transaction_type || "-"}</td>
        <td className="text-center">{Data.createdAt || "-"}</td>

        <td className="text-center">
          <div className="text-center">
            <div
              className={`badge ${
                Data.type == 1 ? "badge-success" : "badge-danger"
              }`}
            >
              {Data.type == 1 ? "Credit" : "Debit"}
            </div>
          </div>
        </td>
      </tr>
    );
};

export default List;
