"""RBP Application Provisioning Request DocType controller."""

import frappe
from frappe.model.document import Document

from rbp_app.services.environment import is_application_provisioning_enabled


class RBPApplicationProvisioningRequest(Document):
	def validate(self):
		if not is_application_provisioning_enabled():
			frappe.throw("Application provisioning is disabled for this environment.")
