import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { OnboardingICP } from "./routes/OnboardingICP";
import { OnboardingProduct } from "./routes/OnboardingProduct";
import { ScoutSearch } from "./routes/ScoutSearch";
import { Pipeline } from "./routes/Pipeline";
import { Leads } from "./routes/Leads";
import { EmailReview } from "./routes/EmailReview";
import { ConversationApproval } from "./routes/ConversationApproval";
import { Schedule } from "./routes/Schedule";
import { BookingSuccess } from "./routes/BookingSuccess";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding/icp" replace />} />
        <Route path="/onboarding/icp" element={<OnboardingICP />} />
        <Route path="/onboarding/product" element={<OnboardingProduct />} />
        <Route path="/search" element={<ScoutSearch />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:leadId" element={<ConversationApproval />} />
        <Route path="/email/:leadId" element={<EmailReview />} />
        <Route path="/schedule/:leadId" element={<Schedule />} />
        <Route path="/success/:leadId" element={<BookingSuccess />} />
        <Route path="*" element={<Navigate to="/leads" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
