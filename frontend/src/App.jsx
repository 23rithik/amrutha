import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Login from './components/Login';
import SignupPediatrician from './components/SignupPediatrician';
import SignupParent from './components/SignupParent';
import Adminhome from './components/admin/Adminhome';
import PrivateRoutes from './components/Privateroutes';
import ParentApproval from './components/admin/ParentApproval';
import PediatricianApproval from './components/admin/PediatricianApproval';
import AdminFeedback from './components/admin/AdminFeedback';
import AdminPediatricFeedback from './components/admin/AdminPediatricFeedback';
import ActivityMonitoring from './components/admin/ActivityMonitoring';
import PediatricianHomepage from './components/pediatrician/PediatricianHomepage';
import ParentHomepage from './components/parent/ParentHomepage';
import ParentDashboard from './components/parent/ParentDashboard';
import EditParentProfile from './components/parent/EditParentProfile';
import ReferredHospitals from './components/parent/ParentReferredHospitals';
import ParentDietChart from './components/parent/ParentDietChart';
import ParentFeedbackPage from './components/parent/ParentFeedbackPage';
import ParentPediatricianFeedbackPage from './components/parent/ParentPediatricianFeedbackPage';
import EditPediatricProfile from './components/pediatrician/EditPediatricProfile';
import ReferHospital from './components/pediatrician/ReferHospital';
import DietChartPage from './components/pediatrician/DietChartPage';
import PediatricianFeedback from './components/pediatrician/PediatricianparentFeedback';
import PediatricianAdminFeedback from './components/pediatrician/PediatricianAdminFeedback';
import ParentAIChatbot from './components/parent/ParentAIChatbot';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup-pediatrition" element={<SignupPediatrician />} />
      <Route path="/signup-parent" element={<SignupParent />} />


      <Route element={<PrivateRoutes />}>
        <Route path="/adminhome" element={<Adminhome />} />
        <Route path="/parentapprove" element={<ParentApproval />} />
        <Route path="/pediatricianapprove" element={<PediatricianApproval />} />
        <Route path="/parentfeedback" element={<AdminFeedback />} />
        <Route path="/pediatricianfeedback" element={<AdminPediatricFeedback />} />
        <Route path="/activity" element={<ActivityMonitoring />} />

        <Route path="/pediatrichome" element={<PediatricianHomepage/>} />
        <Route path='/pediatric-editprofile' element={<EditPediatricProfile/>} />
        <Route path="refer-hospitals" element={<ReferHospital />} />
        <Route path="/give-diet" element={<DietChartPage />} />
        <Route path="feedback-pediatric/parent" element={<PediatricianFeedback />} />
        <Route path="/feedback-pediatric/admin" element={<PediatricianAdminFeedback />} />
        
        {/* Nested routes for Parent */}


        <Route path="/patienthome" element={<ParentHomepage />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/editprofile" element={<EditParentProfile/>}/>
        <Route path='/referred-hospitals' element={<ReferredHospitals />} />
        <Route path='/diet-chart' element={<ParentDietChart/>}/>
        <Route path='/feedback/admin' element={<ParentFeedbackPage />} />
        <Route path='/feedback/pediatrician' element={<ParentPediatricianFeedbackPage/>} />
        <Route path="/assistant" element={<ParentAIChatbot/>}/>
        

      </Route>
    </Routes>
  );
};

export default App;
