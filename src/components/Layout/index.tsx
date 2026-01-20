import TopBar from "@/components/TopBar";
import { Outlet } from "react-router-dom";
import HistorySidebar from "../HistorySidebar";
import { InstallDependencies } from "@/components/InstallStep/InstallDependencies";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { AnimationJson } from "@/components/AnimationJson";
import animationData from "@/assets/animation/onboarding_success.json";
import CloseNoticeDialog from "../Dialog/CloseNotice";
import { useInstallationUI } from "@/store/installationStore";
import { useInstallationSetup } from "@/hooks/useInstallationSetup";
import InstallationErrorDialog from "../InstallStep/InstallationErrorDialog/InstallationErrorDialog";
import Halo from "../Halo";
import useChatStoreAdapter from "@/hooks/useChatStoreAdapter";

const Layout = () => {
	const { initState, isFirstLaunch, setIsFirstLaunch } = useAuthStore();
	const [noticeOpen, setNoticeOpen] = useState(false);

	const {
		installationState,
		latestLog,
		error,
		backendError,
		isInstalling,
		shouldShowInstallScreen,
		retryInstallation,
		retryBackend,
	} = useInstallationUI();

	//Get Chatstore for the active project's task
	const { chatStore } = useChatStoreAdapter();

	// Determine what to show based on states
	const shouldShowOnboarding = initState === "done" && isFirstLaunch && !isInstalling;
	const actualShouldShowInstallScreen = shouldShowInstallScreen || initState !== 'done' || installationState === 'waiting-backend';

	// If we need to show install screen, return it immediately to avoid blocking by chatStore check
	if (actualShouldShowInstallScreen) {
		return (
			<div className="h-full flex flex-col relative overflow-hidden">
				<TopBar />
				<div className="flex-1 h-full min-h-0 overflow-hidden relative">
					<InstallDependencies />
				</div>
			</div>
		);
	}

	if (!chatStore) {
		console.log(chatStore);
		return (
			<div className="h-full flex flex-col relative overflow-hidden">
				<TopBar />
				<div className="flex-1 h-full min-h-0 overflow-hidden relative flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<div className="text-text-label text-sm">Đang tải dữ liệu...</div>
					</div>
				</div>
			</div>
		);
	}

	useEffect(() => {
		const handleBeforeClose = () => {
			const currentStatus = chatStore.tasks[chatStore.activeTaskId as string]?.status;
			if (["running", "pause"].includes(currentStatus)) {
				setNoticeOpen(true);
			} else {
				window.electronAPI.closeWindow(true);
			}
		};

		window.ipcRenderer.on("before-close", handleBeforeClose);

		return () => {
			window.ipcRenderer.removeAllListeners("before-close");
		};
	}, [chatStore.tasks, chatStore.activeTaskId]);

	// Determine what to show based on states
	// const shouldShowOnboarding = initState === "done" && isFirstLaunch && !isInstalling;
	// const actualShouldShowInstallScreen = shouldShowInstallScreen || initState !== 'done' || installationState === 'waiting-backend';
	const shouldShowMainContent = !actualShouldShowInstallScreen;

	return (
		<div className="h-full flex flex-col relative overflow-hidden">
			<TopBar />
			<div className="flex-1 h-full min-h-0 overflow-hidden relative">
				{/* Onboarding animation */}
				{shouldShowOnboarding && (
					<AnimationJson
						onComplete={() => setIsFirstLaunch(false)}
						animationData={animationData}
					/>
				)}

				{/* Installation screen */}
				{actualShouldShowInstallScreen && <InstallDependencies />}

				{/* Main app content */}
				{shouldShowMainContent && (
					<>
						<Outlet />
						<HistorySidebar />
					</>
				)}

				{(backendError || (error && installationState === "error")) && (
					<InstallationErrorDialog
						error={error || ""}
						backendError={backendError}
						installationState={installationState}
						latestLog={latestLog}
						retryInstallation={retryInstallation}
						retryBackend={retryBackend}
					/>
				)}

				<CloseNoticeDialog
					onOpenChange={setNoticeOpen}
					open={noticeOpen}
				/>
				<Halo />
			</div>
		</div>
	);
};

export default Layout;
