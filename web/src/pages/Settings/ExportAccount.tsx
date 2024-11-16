import { ExternalLink } from "lucide-react";
import { Button } from "../../components/ui/button";
import { CardContent } from "../../components/ui/card";

export default function ExportAccount() {
	return (
		<CardContent>
			<h2 className="text-xl font-bold">Export Account</h2>
			<p>
				Export your account data. This will include all your messages,
				contacts, and other data.
			</p>
			<p className="text-sm text-gray-500 mt-3">
				Selection of data to export is not available at the moment.
			</p>
			<Button className="flex gap-1 mt-2">
				Export <ExternalLink />
			</Button>
		</CardContent>
	);
}
