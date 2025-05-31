import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import GamePage from "./pages/GamePage";
import ProgressPage from "./pages/ProgressPage";
import ProfilePage from "./pages/ProfilePage";
import OnboardingPage from "./pages/OnboardingPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import { UserProvider } from "./contexts/UserContext";
import { GameProvider } from "./contexts/GameContext";

const queryClient = new QueryClient();

const App = () =>
<QueryClientProvider client={queryClient} data-id="mwx0zwalw" data-path="src/App.tsx">
    <TooltipProvider data-id="eipl5ux4b" data-path="src/App.tsx">
      <UserProvider data-id="z9rqibqcj" data-path="src/App.tsx">
        <GameProvider data-id="o1n4ksbfi" data-path="src/App.tsx">
          <Toaster data-id="jz1rttf5h" data-path="src/App.tsx" />
          <BrowserRouter data-id="cb0j99uwd" data-path="src/App.tsx">
            <Routes data-id="f5f673mq1" data-path="src/App.tsx">
              <Route path="/" element={<HomePage data-id="t68u1zq45" data-path="src/App.tsx" />} data-id="sr7yssvwx" data-path="src/App.tsx" />
              <Route path="/onboarding" element={<OnboardingPage data-id="2lz55798p" data-path="src/App.tsx" />} data-id="8yfgy9zs3" data-path="src/App.tsx" />
              <Route path="/game/:gameType" element={<GamePage data-id="zvqi8d3cs" data-path="src/App.tsx" />} data-id="qx2uuf9e2" data-path="src/App.tsx" />
              <Route path="/progress" element={<ProgressPage data-id="jzk5a3q2s" data-path="src/App.tsx" />} data-id="39rclmj79" data-path="src/App.tsx" />
              <Route path="/profile" element={<ProfilePage data-id="d21q3ue9q" data-path="src/App.tsx" />} data-id="sxnzwe2x5" data-path="src/App.tsx" />
              <Route path="/subscription" element={<SubscriptionPage data-id="h4pzsi23m" data-path="src/App.tsx" />} data-id="o5mx7vfwr" data-path="src/App.tsx" />
              <Route path="*" element={<NotFound data-id="gi3n9pyor" data-path="src/App.tsx" />} data-id="afyzvz1bv" data-path="src/App.tsx" />
            </Routes>
          </BrowserRouter>
        </GameProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>;


export default App;