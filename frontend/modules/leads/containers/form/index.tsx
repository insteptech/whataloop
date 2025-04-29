import { useRouter } from "next/router";

function Leads () {
  
const router = useRouter();
  return (
    <div className="leads-container">
      <div className="leads-header">
        <h2>Leads Form</h2>
      </div>
      <div className="leads-body">
        <p>Form goes here</p>
        <button onClick={()=>router.push('/leads/createLead')}>create a lead</button>
      </div>
    </div>
  );
}

export default Leads;