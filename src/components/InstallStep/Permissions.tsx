import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { ArrowRight, Square, SquareCheckBig } from "lucide-react";
import { Button } from "../ui/button";
import { proxyFetchGet, proxyFetchPut } from "@/api/http";
import privacy_settings from '@/assets/privacy_settings.png'
import { useTranslation } from "react-i18next";

export const Permissions: React.FC = () => {
	const { setInitState } = useAuthStore();
	const { t } = useTranslation();
	const API_FIELDS = [
		"take_screenshot",
		"access_local_software",
		"access_your_address",
		"password_storage",
	];
	const [settings, setSettings] = useState([
		{
			title: t("layout.allow-agent-to-take-screenshots"),
			description: t("layout.permit-the-agent-to-capture"),
			checked: false,
		},
		{
			title: t("layout.allow-agent-to-access-local-software"),
			description: t("layout.grant-the-agent-permission"),
			checked: false,
		},
		{
			title: t("layout.allow-agent-to-access-your-address"),
			description: t("layout.authorize-the-agent-to-view"),
			checked: false,
		},
		{
			title: t("layout.password-storage"),
			description: t("layout.determine-how-passwords-are-handled"),
			checked: false,
		},
	]);
	useEffect(() => {
		proxyFetchGet("/api/user/privacy")
			.then((res) => {
				setSettings((prev) =>
					prev.map((item, index) => ({
						...item,
						checked: res[API_FIELDS[index]] || false,
					}))
				);
			})
			.catch((err) => console.error("Failed to fetch settings:", err));
	}, []);
	const handleToggle = (index: number) => {
		setSettings((prev) => {
			const newSettings = [...prev];
			newSettings[index] = {
				...newSettings[index],
				checked: !newSettings[index].checked,
			};
			return newSettings;
		});

		const requestData = {
			[API_FIELDS[0]]: settings[0].checked,
			[API_FIELDS[1]]: settings[1].checked,
			[API_FIELDS[2]]: settings[2].checked,
			[API_FIELDS[3]]: settings[3].checked,
		};

		requestData[API_FIELDS[index]] = !settings[index].checked;

		proxyFetchPut("/api/user/privacy", requestData).catch((err) =>
			console.error("Failed to update settings:", err)
		);
	};
	return (
		<div className="flex flex-col gap-lg">
			<div className="flex gap-md h-[568px] ">
				<div className=" flex flex-col gap-md w-[438px]">
					<div className="text-text-heading font-bold text-4xl leading-5xl">
						<div>{t("layout.turn-on-all-privacy-settings")}</div>
					</div>
					<div className="text-text-body text-xl leading-2xl font-medium">
						{t("layout.eigent-is-a-desktop-software")}
					</div>
					{settings.map((item, index) => (
						<div
							key={item.title}
							onClick={() => handleToggle(index)}
							className="flex gap-sm items-center p-xs hover:bg-fill-fill-tertiary-hover rounded-md cursor-pointer"
						>
							<div>
								{item.checked ? (
									<SquareCheckBig size={24} className="text-icon-success" />
								) : (
									<Square size={24} className="text-icon-primary" />
								)}
							</div>
							<div className="flex-1 flex flex-col">
								<div className="text-text-body font-medium leading-2xl text-xl">
									{item.title}
								</div>
								<div className="text-text-label text-sm">
									{item.description}
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="flex-1 rounded-3xl relative">
					<img className="absolute top-0 left-0 right-0 bottom-0 w-[899px] h-[533px]" src={privacy_settings} alt="" />
				</div>
			</div>
			<div className="flex justify-end items-center gap-sm">

				<div className="flex  justify-center items-center gap-sm">
					<Button
						onClick={() => setInitState("carousel")}
						variant="ghost"
						size="sm"
					>
						{t("layout.cancel")}
					</Button>
					<Button
						onClick={() => setInitState("carousel")}
						variant="primary"
						size="sm"
					>
						<div>{t("layout.continue")}</div>
						<ArrowRight size={24} className="text-white-100%" />
					</Button>
				</div>
			</div>
		</div>
	);
};
