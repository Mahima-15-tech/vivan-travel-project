import React from "react";

const ReportTableRow = ({ ReportedUser }) => {
  return (
    <tr>
      <td className="text-center">{ReportedUser.id|| "-"}</td>
      <td className="text-center">{ReportedUser.id|| "-"}</td>
      <td className="text-center">{ReportedUser.label || "N/A"}</td>
      <td className="text-center">{ReportedUser.description || "N/A"}</td>
      

     

      <td>
        <div className="d-flex justify-content-center gap-2">

          <button type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap"><i className="tio-edit"></i></button>

          <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Update Report Status</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="form-group">
                      <label for="recipient-name" class="col-form-label">Status :</label>
                      <select name="status" id="status" class="form-control">
                      <option value="Pending">Select Status</option>
                        <option value="Pending">Active</option>
                        <option value="Pending">Deactive</option>
                      </select>
                      <input type="hidden" value={`${ReportedUser.id}`} id="id" name="id" />
                    </div>

                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Delete form could be handled separately */}
      </td>
    </tr>
  );
};
export default ReportTableRow;
