import {
	Card,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import AccountDeletion from "./AccountDeletion";
import ChangePassword from "./ChangePassword";
import ExportAccount from "./ExportAccount";

export default function Settings() {
	return (
		<Card className="w-full h-full flex flex-col">
			<CardHeader>
				<CardTitle className="py-2 flex items-center">
					Settings
				</CardTitle>
			</CardHeader>
			<ChangePassword />
			<ExportAccount />
			<AccountDeletion />
		</Card>
	);
}
