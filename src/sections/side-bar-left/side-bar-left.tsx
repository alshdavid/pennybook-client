import "./side-bar-left.scss"
import { h } from "preact";
import { Icon } from "../../components/icon/icon.tsx";
import { useRouter } from "../../platform/router/preact.tsx";

export function SideBarLeft() {
  const router = useRouter()

  return <nav className="side-bar-left">
    <div className="top-bar">
      <div className="logo">
        <Icon icon="brand-hollow" />
        <span>pennybook</span>
      </div>
    </div>
    <section>
      <div 
        onClick={() => router.navigate('/dashboard')}
        className="large active">Dashboard</div>
      <div 
      onClick={() => router.navigate('/budget')}
        className="large">Budget</div>
      <div 
      onClick={() => router.navigate('/query')}
      
        className="large">Query</div>
    </section>
    <section>
      <div 
        onClick={() => router.navigate('/accounts')}      
        className="account heading">
        <span>All Accounts</span>
        <span>100,000</span>        
      </div>
      <div 
        onClick={() => router.navigate('/accounts/1')}      
        className="account">
        <span>General</span>
        <span>1,000</span>        
      </div>
      <div 
        onClick={() => router.navigate('/accounts/2')}      
        className="account">
        <span>Savings</span>
        <span>9,000</span>        
      </div>
      <br/>
      <div className="account heading">
        <span>Closed Accounts</span>
        <span>0</span>        
      </div>
    </section>
  </nav>
}