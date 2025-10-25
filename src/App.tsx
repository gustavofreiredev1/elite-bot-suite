import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateBot from "./pages/CreateBot";
import MyBots from "./pages/MyBots";
import BotDetail from "./pages/BotDetail";
import Stats from "./pages/Stats";
import Analytics from "./pages/Analytics";
import Automations from "./pages/Automations";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AutoPostPage from "./pages/tools/AutoPostPage";
import AutoPayPage from "./pages/tools/AutoPayPage";
import CreateSessionsPage from "./pages/tools/CreateSessionsPage";
import AddMembersPage from "./pages/tools/AddMembersPage";
import TClonePage from "./pages/tools/TClonePage";
import ViewsTrackingPage from "./pages/tools/ViewsTrackingPage";
import SuperBotPage from "./pages/tools/SuperBotPage";
import MassSenderPage from "./pages/tools/MassSenderPage";
import UserScraperPage from "./pages/tools/UserScraperPage";
import PollBotPage from "./pages/tools/PollBotPage";
import MessageBackupPage from "./pages/tools/MessageBackupPage";
import InactiveCleanerPage from "./pages/tools/InactiveCleanerPage";
import MediaExtractorPage from "./pages/tools/MediaExtractorPage";
import AccountGeneratorPage from "./pages/tools/AccountGeneratorPage";
import AutoReactPage from "./pages/tools/AutoReactPage";
import SecurityBotPage from "./pages/tools/SecurityBotPage";
import MassReactPage from "./pages/tools/MassReactPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-bot"
            element={
              <ProtectedRoute>
                <CreateBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bots"
            element={
              <ProtectedRoute>
                <MyBots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id"
            element={
              <ProtectedRoute>
                <BotDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/automations"
            element={
              <ProtectedRoute>
                <Automations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/autopost"
            element={
              <ProtectedRoute>
                <AutoPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/autopay"
            element={
              <ProtectedRoute>
                <AutoPayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/sessions"
            element={
              <ProtectedRoute>
                <CreateSessionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/addmembers"
            element={
              <ProtectedRoute>
                <AddMembersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/tclone"
            element={
              <ProtectedRoute>
                <TClonePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/views"
            element={
              <ProtectedRoute>
                <ViewsTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/superbot"
            element={
              <ProtectedRoute>
                <SuperBotPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/masssender"
            element={
              <ProtectedRoute>
                <MassSenderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/userscraper"
            element={
              <ProtectedRoute>
                <UserScraperPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/pollbot"
            element={
              <ProtectedRoute>
                <PollBotPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/messagebackup"
            element={
              <ProtectedRoute>
                <MessageBackupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/inactivecleaner"
            element={
              <ProtectedRoute>
                <InactiveCleanerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/mediaextractor"
            element={
              <ProtectedRoute>
                <MediaExtractorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/accountgen"
            element={
              <ProtectedRoute>
                <AccountGeneratorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/autoreact"
            element={
              <ProtectedRoute>
                <AutoReactPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/security"
            element={
              <ProtectedRoute>
                <SecurityBotPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bot/:id/massreact"
            element={
              <ProtectedRoute>
                <MassReactPage />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
