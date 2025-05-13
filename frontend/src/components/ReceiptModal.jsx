import { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintableReceipt from "./PrintableReceipt";
import { FaFilePdf } from "react-icons/fa";
import { useGetCompaniesQuery } from '../features/company/companiesSlice';



const ReceiptModal = ({ receiptData }) => {
  const receiptRef = useRef(null);
  
  const { data: companies, isLoading, error } = useGetCompaniesQuery();
  
  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
  });

  return (
    <div className="modal mx-auto p-3" id="receipt-modal" data-bs-backdrop="static">
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">

          <div className="modal-body">   

            {companies && companies.length > 0 ? (
              <PrintableReceipt ref={receiptRef} receiptData={receiptData} company={companies[0]} />
            ) : (
              <PrintableReceipt ref={receiptRef} receiptData={receiptData} company={{}} />
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-success" onClick={handlePrintReceipt}><FaFilePdf/></button>
            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
