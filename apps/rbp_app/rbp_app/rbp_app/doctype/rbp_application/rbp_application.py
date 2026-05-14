"""RBP Application DocType controller."""

import frappe
from frappe.model.document import Document


class RBPApplication(Document):
	def validate(self):
		if self.provisioning_enabled:
			from rbp_app.services.environment import is_application_provisioning_enabled

			if not is_application_provisioning_enabled():
				frappe.throw("Application provisioning is disabled for this environment.")
