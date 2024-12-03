import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchOffices } from "../features/branchOffice";

const BranchOfficeSelector = () => {
  const dispatch = useDispatch();
  const branchOffices = useSelector((state) => state.branchOffice);
  const [selectedOffice, setSelectedOffice] = useState(null);

  useEffect(() => {
    dispatch(fetchBranchOffices());
  }, [dispatch]);

  return (
    <div>
      <h2>Sucursales Disponibles</h2>
      <ul>
        {branchOffices.length > 0 ? (
          branchOffices.map((office) => (
            <li key={office._id} onClick={() => setSelectedOffice(office)}>
              {office.address} - {office.location}
            </li>
          ))
        ) : (
          <p>No hay sucursales disponibles.</p>
        )}
      </ul>
      {selectedOffice && (
        <div>
          <h3>Sucursal seleccionada:</h3>
          <p>{selectedOffice.address}</p>
        </div>
      )}
    </div>
  );
};

export default BranchOfficeSelector;
